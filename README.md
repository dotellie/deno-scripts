# deno-scripts

A collection of Deno scripts of varying usefulness

## bump-version

Simple version management for Deno.

### Usage

Add the following to `deno.json`:

```json
{
  "tasks": {
    "version": "deno run -Ar https://esm.sh/gh/dotellie/version@typescript-file/index.ts",
    "bump-version": "deno run -A https://esm.sh/gh/dotellie/deno-scripts/bump-version.ts"
  }
}
```

Initialize a version file:

```sh
deno task version init --ts
```

When releasing a new version, make sure everything is committed and run the
following:

```sh
deno task bump-version
```
