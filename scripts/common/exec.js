import shell from "shelljs";

const getExec = () => {
  const codes = [];

  const exec = (command, ignoreCode = false) => {
    console.log("Executing: ", command);
    const code = shell.exec(command).code;
    console.log("Exit code:", code);
    if (!ignoreCode) {
      codes.push(code);
    }
    return code;
  };

  const getExitCode = () => {
    if (codes.find((code) => code !== 0)) {
      return 1;
    } else {
      return 0;
    }
  };

  const checkExit = () => {
    const exitCode = getExitCode();
    if (exitCode !== 0) {
      console.error(
        '\nSummary: One of the commands failed. Search for "Exit code: 1" in log for more details.'
      );
      process.exit(1);
    } else {
      console.log("\nSummary: All checks have passed!");
      process.exit(0);
    }
  };

  return {
    exec,
    checkExit,
    getExitCode,
  };
};

export default getExec;
