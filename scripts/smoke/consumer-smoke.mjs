import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const tempRoot = await mkdtemp(join(tmpdir(), "hyde-park-smoke-"));
const tarballsDir = join(tempRoot, "tarballs");

async function run(command, args, cwd) {
  await execFileAsync(command, args, {
    cwd,
    maxBuffer: 1024 * 1024 * 10
  });
}

async function packPackage(packageDir) {
  await run("pnpm", ["pack", "--pack-destination", tarballsDir], packageDir);
  const packageJson = JSON.parse(await readFile(join(packageDir, "package.json"), "utf8"));
  return join(
    tarballsDir,
    `${packageJson.name.replace("@", "").replace("/", "-")}-${packageJson.version}.tgz`
  );
}

async function writeConsumerPackageJson(consumerDir, overrides = {}) {
  await writeFile(
    join(consumerDir, "package.json"),
    JSON.stringify(
      {
        name: "consumer-smoke",
        private: true,
        type: "module",
        pnpm: {
          overrides
        }
      },
      null,
      2
    ) + "\n"
  );
}

async function assertInstalledVersion(consumerDir, packageSegments, expectedVersion) {
  const installed = JSON.parse(
    await readFile(join(consumerDir, "node_modules", ...packageSegments, "package.json"), "utf8")
  );

  if (installed.version !== expectedVersion) {
    throw new Error(
      `Expected ${packageSegments.join("/")} to be installed at ${expectedVersion}, received ${installed.version}`
    );
  }
}

try {
  await mkdir(tarballsDir, { recursive: true });

  const utilTarball = await packPackage(join(rootDir, "packages/utils/deep-merge"));
  const composableTarball = await packPackage(join(rootDir, "packages/composables/use-debounce"));
  const miniVueTarball = await packPackage(join(rootDir, "packages/fun/mini-vue"));
  const umbrellaTarball = await packPackage(join(rootDir, "packages/meta/hyde-park"));

  const leafConsumerDir = join(tempRoot, "leaf-consumer");
  await mkdir(leafConsumerDir, { recursive: true });
  await writeConsumerPackageJson(leafConsumerDir, {
    "@ddosdor/hyde-park-util-deep-merge": `file:${utilTarball}`
  });

  await run(
    "pnpm",
    [
      "add",
      `file:${utilTarball}`,
      `file:${composableTarball}`,
      "vue@^3.5.30"
    ],
    leafConsumerDir
  );

  await writeFile(
    join(leafConsumerDir, "verify.mjs"),
    `import { ref } from "vue";
import { useDebounce } from "@ddosdor/hyde-park-composable-use-debounce";
import { deepMerge } from "@ddosdor/hyde-park-util-deep-merge";

const merged = deepMerge({ base: { delay: 100 } }, { base: { delay: 200 } });
if (merged.base.delay !== 200) {
  throw new Error("deepMerge import failed");
}

const debounced = useDebounce(ref("value"), { delay: 10 });
if (debounced.value !== "value") {
  throw new Error("useDebounce import failed");
}
`
  );

  await run("node", ["./verify.mjs"], leafConsumerDir);
  await assertInstalledVersion(leafConsumerDir, ["@ddosdor", "hyde-park-util-deep-merge"], "0.1.0");
  await assertInstalledVersion(leafConsumerDir, ["@ddosdor", "hyde-park-composable-use-debounce"], "0.1.0");

  const funConsumerDir = join(tempRoot, "fun-consumer");
  await mkdir(funConsumerDir, { recursive: true });
  await writeConsumerPackageJson(funConsumerDir);

  await run("pnpm", ["add", `file:${miniVueTarball}`], funConsumerDir);
  await writeFile(
    join(funConsumerDir, "verify.mjs"),
    `import { component, h, reactive, ref, watchEffect } from "@ddosdor/hyde-park-fun-mini-vue";
import { jsx } from "@ddosdor/hyde-park-fun-mini-vue/jsx-runtime";

const state = reactive({ count: 1 });
let snapshot = 0;
watchEffect(() => {
  snapshot = state.count;
});
state.count = 2;

if (snapshot !== 2) {
  throw new Error("reactive export failed");
}

const localRef = ref("value");
if (localRef.value !== "value") {
  throw new Error("ref export failed");
}

const Greeting = component((props = { name: "Hyde Park" }) => h("div", { title: props.name }, [props.name]));
if (Greeting({ name: "Mini Vue" }).tag !== "div") {
  throw new Error("component export failed");
}

if (jsx("section", { children: ["runtime"] }).tag !== "section") {
  throw new Error("jsx runtime export failed");
}
`
  );

  await run("node", ["./verify.mjs"], funConsumerDir);
  await assertInstalledVersion(funConsumerDir, ["@ddosdor", "hyde-park-fun-mini-vue"], "0.1.0");

  const umbrellaConsumerDir = join(tempRoot, "umbrella-consumer");
  await mkdir(umbrellaConsumerDir, { recursive: true });
  await writeConsumerPackageJson(umbrellaConsumerDir, {
    "@ddosdor/hyde-park-composable-use-debounce": `file:${composableTarball}`,
    "@ddosdor/hyde-park-util-deep-merge": `file:${utilTarball}`
  });

  await run(
    "pnpm",
    [
      "add",
      `file:${utilTarball}`,
      `file:${composableTarball}`,
      `file:${umbrellaTarball}`,
      "vue@^3.5.30"
    ],
    umbrellaConsumerDir
  );

  await writeFile(
    join(umbrellaConsumerDir, "verify.mjs"),
    `import { deepMerge as rootMerge } from "@ddosdor/hyde-park";
import { useDebounce } from "@ddosdor/hyde-park/composables/use-debounce";
import { deepMerge } from "@ddosdor/hyde-park/utils/deep-merge";
import { ref } from "vue";

if (rootMerge({ a: 1 }, { b: 2 }).b !== 2) {
  throw new Error("Root umbrella export failed");
}

if (deepMerge({ api: { enabled: false } }, { api: { enabled: true } }).api.enabled !== true) {
  throw new Error("Subpath utility export failed");
}

if (useDebounce(ref("ready"), { delay: 5 }).value !== "ready") {
  throw new Error("Subpath composable export failed");
}
`
  );

  await run("node", ["./verify.mjs"], umbrellaConsumerDir);
  await assertInstalledVersion(umbrellaConsumerDir, ["@ddosdor", "hyde-park"], "0.1.0");
  await assertInstalledVersion(umbrellaConsumerDir, ["@ddosdor", "hyde-park-util-deep-merge"], "0.1.0");
  await assertInstalledVersion(umbrellaConsumerDir, ["@ddosdor", "hyde-park-composable-use-debounce"], "0.1.0");
} finally {
  await rm(tempRoot, { recursive: true, force: true });
}

console.log("Smoke tests passed.");
