const hooksDir = ".git/hooks";
const preCommitHookSource = "./.tasks/hooks/pre-commit.sh";
const preCommitHookDestination = `${hooksDir}/pre-commit`;

await Deno.copyFile(preCommitHookSource, preCommitHookDestination);
await Deno.chmod(preCommitHookDestination, 0o755);
