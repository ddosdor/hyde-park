import { access, mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = new Map();
for (let index = 2; index < process.argv.length; index += 1) {
  const entry = process.argv[index];

  if (!entry.startsWith("--")) {
    continue;
  }

  if (entry.includes("=")) {
    const [key, value] = entry.slice(2).split("=");
    args.set(key, value);
    continue;
  }

  const nextValue = process.argv[index + 1];
  if (!nextValue || nextValue.startsWith("--")) {
    args.set(entry.slice(2), "true");
    continue;
  }

  args.set(entry.slice(2), nextValue);
  index += 1;
}

const type = args.get("type");
const name = args.get("name");

if (!type || !name) {
  console.error("Usage: pnpm new:package -- --type <composable|util> --name <kebab-case-name>");
  process.exit(1);
}

if (!["composable", "util"].includes(type)) {
  console.error("Supported package types: composable, util");
  process.exit(1);
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(name)) {
  console.error("Package name must be kebab-case.");
  process.exit(1);
}

const category = type === "composable" ? "composables" : "utils";
const functionName = name
  .split("-")
  .map((segment, index) => (index === 0 ? segment : segment.charAt(0).toUpperCase() + segment.slice(1)))
  .join("");
const packageName = `@ddosdor/hyde-park-${type}-${name}`;
const packageDir = join(rootDir, "packages", category, name);
const docsFile = join(rootDir, "apps", "docs", "docs", "packages", category, `${name}.md`);

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

if (await exists(packageDir)) {
  console.error(`Package directory already exists: ${packageDir}`);
  process.exit(1);
}

if (await exists(docsFile)) {
  console.error(`Docs file already exists: ${docsFile}`);
  process.exit(1);
}

const packageJson = {
  name: packageName,
  version: "0.1.0",
  description: `${type === "composable" ? "Vue composable" : "TypeScript utility"} from Hyde Park.`,
  license: "MIT",
  type: "module",
  sideEffects: false,
  files: ["dist"],
  main: "./dist/index.cjs",
  module: "./dist/index.js",
  types: "./dist/index.d.ts",
  exports: {
    ".": {
      types: "./dist/index.d.ts",
      import: "./dist/index.js",
      require: "./dist/index.cjs"
    }
  },
  publishConfig: {
    access: "public"
  },
  scripts: {
    build: "tsup",
    lint: "eslint .",
    typecheck: "tsc --project tsconfig.json",
    test: "vitest run",
    clean:
      "node -e \"const fs=require('node:fs'); for (const path of ['dist','coverage','.turbo']) fs.rmSync(path,{recursive:true,force:true});\""
  },
  devDependencies: {
    "@ddosdor/hyde-park-typescript-config": "workspace:*"
  }
};

if (type === "composable") {
  packageJson.peerDependencies = {
    vue: "^3.5.30"
  };
}

const sourceCode =
  type === "composable"
    ? `import { readonly, ref, watch, type Ref } from "vue";
import { onScopeDispose } from "vue";

export interface ${functionName.charAt(0).toUpperCase() + functionName.slice(1)}Options {
  delay?: number;
}

export function ${functionName}<T>(source: Ref<T>, options: ${functionName.charAt(0).toUpperCase() + functionName.slice(1)}Options = {}): Readonly<Ref<T>> {
  const delay = options.delay ?? 200;
  const output = ref(source.value) as Ref<T>;
  let timeout;

  const clearTimeoutHandle = () => {
    if (timeout === undefined) {
      return;
    }

    clearTimeout(timeout);
    timeout = undefined;
  };

  watch(source, (value) => {
    clearTimeoutHandle();
    timeout = setTimeout(() => {
      output.value = value;
      timeout = undefined;
    }, delay);
  });

  onScopeDispose(clearTimeoutHandle);

  return readonly(output) as Readonly<Ref<T>>;
}
`
    : `export function ${functionName}<T>(value: T): T {
  return value;
}
`;

const testCode =
  type === "composable"
    ? `import { describe, expect, it } from "vitest";
import { ref } from "vue";

import { ${functionName} } from "../src/index";

describe("${functionName}", () => {
  it("returns a readonly ref", () => {
    const state = ${functionName}(ref("value"));
    expect(state.value).toBe("value");
  });
});
`
    : `import { describe, expect, it } from "vitest";

import { ${functionName} } from "../src/index";

describe("${functionName}", () => {
  it("returns the provided value", () => {
    expect(${functionName}("value")).toBe("value");
  });
});
`;

const docsCode = `# ${name
  .split("-")
  .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
  .join(" ")}

Package: \`${packageName}\`

## Install

\`\`\`bash
pnpm add ${packageName}@0.1.0${type === "composable" ? " vue@^3.5.30" : ""}
\`\`\`

## Example

\`\`\`ts
import { ${functionName} } from "${packageName}";
\`\`\`
`;

await mkdir(join(packageDir, "src"), { recursive: true });
await mkdir(join(packageDir, "test"), { recursive: true });

await writeFile(join(packageDir, "package.json"), `${JSON.stringify(packageJson, null, 2)}\n`);
await writeFile(
  join(packageDir, "tsconfig.json"),
  `{
  "extends": "../../tooling/typescript-config/library.json",
  "compilerOptions": {
    "types": [
      "node",
      "vitest/globals"
    ]
  },
  "include": [
    "src",
    "test",
    "tsup.config.ts"
  ]
}
`
);
await writeFile(
  join(packageDir, "tsup.config.ts"),
  `import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  sourcemap: true,
  target: "es2022"
});
`
);
await writeFile(join(packageDir, "src", "index.ts"), sourceCode);
await writeFile(join(packageDir, "test", "index.test.ts"), testCode);
await writeFile(docsFile, docsCode);

console.log(`Created ${packageName}`);
