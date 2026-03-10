import { describe, expect, it } from "vitest";

import { deepMerge } from "../src/index";

describe("deepMerge", () => {
  it("merges nested records without mutating the inputs", () => {
    const defaults = {
      delays: {
        primary: 100,
        secondary: 200
      },
      metadata: {
        enabled: true
      }
    };
    const overrides = {
      delays: {
        secondary: 350
      }
    };

    const merged = deepMerge(defaults, overrides);

    expect(merged).toEqual({
      delays: {
        primary: 100,
        secondary: 350
      },
      metadata: {
        enabled: true
      }
    });
    expect(defaults.delays.secondary).toBe(200);
  });

  it("replaces arrays and clones nested values from the source", () => {
    const merged = deepMerge(
      {
        tags: ["stable"],
        config: {
          regions: ["eu-central-1"]
        }
      },
      {
        tags: ["beta", "preview"],
        config: {
          regions: ["us-east-1"]
        }
      }
    );

    expect(merged.tags).toEqual(["beta", "preview"]);
    expect(merged.config.regions).toEqual(["us-east-1"]);

    const sourceRegions = ["ap-southeast-1"];
    const cloned = deepMerge({ config: { regions: [] as string[] } }, { config: { regions: sourceRegions } });
    sourceRegions.push("eu-west-1");
    expect(cloned.config.regions).toEqual(["ap-southeast-1"]);
  });
});
