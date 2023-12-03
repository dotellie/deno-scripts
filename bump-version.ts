import { exec, OutputMode } from "https://deno.land/x/exec@0.0.5/mod.ts";
import { Select } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/select.ts";
import { Confirm } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/confirm.ts";

async function $(command: string) {
  return (await exec(command, { output: OutputMode.Capture })).output.trim();
}

const branchName = await $(`git rev-parse --abbrev-ref HEAD`);

if (branchName !== "main") {
  console.error("You must be on the main branch to run this script.");
  Deno.exit(1);
}

const status = await $(`git status --porcelain`);

if (status !== "") {
  console.error(
    "Working directory is not clean. Please commit all changes first.",
  );
  Deno.exit(1);
}

await exec(`git remote update`, { output: OutputMode.None });

// Check if the local branch is behind the remote branch
const isBehind = (await $(`git status -uno`)).includes("Your branch is behind");

if (isBehind) {
  console.error(
    "Your local branch is behind the remote branch. Please pull the latest changes first.",
  );
  Deno.exit(1);
}

const type = await Select.prompt({
  message: "What type of release is this?",
  options: ["major", "minor", "patch"],
  default: "patch",
});

const confirmed = await Confirm.prompt({
  message:
    `This will create a new release, tagging it and publishing it on the main branch. Are you sure?`,
});

if (!confirmed) {
  console.log("Aborting.");
  Deno.exit(0);
}

await exec(`deno task version ${type}`);

const newVersion = await $(`deno task version get`);

await exec(`git push origin main`);
await exec(`git push origin v${newVersion}`);
