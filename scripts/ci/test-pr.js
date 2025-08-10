import yaml from "js-yaml";
import getExec from "../common/exec.js";

const { exec, checkExit } = getExec();

function getPreExtractedYaml() {
  // Get the pre-extracted YAML from the environment variable
  const yamlContent = process.env.PR_TESTS_YAML || "";
  return yamlContent.trim();
}

function checkShouldRunAllTests(value) {
  if (!value) return false;
  if (value === "all") return true;
  return Array.isArray(value) && value.includes("all");
}

function normalizeSpecs(value) {
  if (!value) return "";
  if (Array.isArray(value)) return value.join(" ");
  return String(value);
}

function runRequested(sectionName, value) {
  const runners = {
    playwright: {
      base: "pnpm exec playwright test --project=chromium",
      onAllArgs: [],
    },
    vitest: {
      base: "pnpm exec vitest run",
      onAllArgs: ["--coverage"],
    },
  };

  const runner = runners[sectionName];
  if (!runner || value == null) return;

  const runAll = checkShouldRunAllTests(value);
  const args = runAll
    ? runner.onAllArgs
    : [normalizeSpecs(value)].filter(Boolean);
  const command = [runner.base, ...args].join(" ").trim();
  exec(command);
}

const main = () => {
  const testConfigs = getPreExtractedYaml();

  if (!testConfigs) {
    console.log("There's no PR Tests configs found, skipped.");
    process.exit(0);
  }

  console.log("Received pre-extracted YAML:");
  console.log(testConfigs);

  try {
    const test = yaml.load(testConfigs);
    console.log("Tests:", test);

    console.log("Use testScripts: ", {
      PLAYWRIGHT: "pnpm exec playwright test --project=chromium",
      VITEST: "pnpm exec vitest run",
    });

    runRequested("playwright", test?.playwright);
    runRequested("vitest", test?.vitest);
  } catch (error) {
    console.error("Failed to parse PR Tests as YAML format.", error);
    process.exit(1);
  } finally {
    checkExit();
  }
};

main();
