import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitepress";

const configDir = dirname(fileURLToPath(import.meta.url));
const docsDir = dirname(configDir);

function toTitle(fileName: string): string {
  return fileName
    .replace(/\.md$/u, "")
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function packageItems(relativeDirectory: string, routeBase: string) {
  return readdirSync(join(docsDir, relativeDirectory))
    .filter((entry) => entry.endsWith(".md"))
    .sort()
    .map((entry) => ({
      text: toTitle(entry),
      link: `${routeBase}/${entry.replace(/\.md$/u, "")}`
    }));
}

export default defineConfig({
  title: "Hyde Park",
  description: "Composable Vue utilities and TypeScript helpers, published as independent npm packages.",
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: "Guide", link: "/" },
      { text: "Installation", link: "/public-api/installation" }
    ],
    sidebar: {
      "/packages/": [
        {
          text: "Composables",
          items: packageItems("packages/composables", "/packages/composables")
        },
        {
          text: "Fun",
          items: packageItems("packages/fun", "/packages/fun")
        },
        {
          text: "Utils",
          items: packageItems("packages/utils", "/packages/utils")
        }
      ],
      "/public-api/": [
        {
          text: "Public API",
          items: packageItems("public-api", "/public-api")
        }
      ]
    },
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/ddosdor/hyde-park"
      }
    ]
  }
});
