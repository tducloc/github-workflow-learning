import yaml from "js-yaml";
import getExec from "../common/exec.js";

const { exec, checkExit } = getExec();

let testConfigs;
try {
  testConfigs = process.env.PULL_REQUEST_BODY.split("### PR Tests")[1]
    .trim()
    .split("```")[1];
} catch (error) {
  console.error("Failed to parse PR Tests section from PR Description.", error);
}

let test;
if (!testConfigs) {
  console.log("There's no PR Tests configs in the PR Description, skipped.");
  process.exit(0);
} else {
  try {
    test = yaml.load(testConfigs);
  } catch (error) {
    console.error("Failed to parse PR Tests as YAML format.", error);
    process.exit(1);
  }
  console.log("Tests:", test);
}

if (test) {
  const testScripts = {
    PLAYWRIGHT: "pnpm exec playwright test --project=chromium",
    VITEST: "pnpm exec vitest run",
  };
  console.log("Use testScripts: ", testScripts);

  if (test.playwright) {
    if (test.playwright === "all") {
      exec(testScripts.PLAYWRIGHT);
    } else {
      const specs = Array.isArray(test.playwright)
        ? test.playwright.join(" ")
        : String(test.playwright);
      exec(`${testScripts.PLAYWRIGHT} ${specs}`);
    }
  }

  if (test.vitest) {
    if (test.vitest === "all") {
      exec(`${testScripts.VITEST} --coverage`);
    } else {
      const specs = Array.isArray(test.vitest)
        ? test.vitest.join(" ")
        : String(test.vitest);
      exec(`${testScripts.VITEST} ${specs}`);
    }
  }
}

checkExit();
