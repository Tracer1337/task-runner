# Simple Runner

Combine javascript functions and bash commands in your node scripts. Every task will be displayed with a spinner in the command line.

```js
const fs = require("fs")
const path = require("path")
const { makeRunnable, exec, run } = require("./index.js")

makeRunnable(async () => {
    await run(createGitRepo, "Create git repository")

    await run(removeGitRepo, "Remove git repository")
})()

async function createGitRepo() {
    await exec("git init")
}

async function removeGitRepo() {
    fs.rmdirSync(path.join(__dirname, "..", ".git"), { recursive: true })
}
```

```bash
√ Create git repository 68.58ms
√ Remove git repository 9.6ms
Executed in 0.08s
```

## Installation

``npm install simple-runner``

## Usage

The ``exec`` function is used to execute bash commands and ``run`` will execute an async function. Create your tasks using async functions, use ``exec`` inside them and run them using ``run``. ``makeRunnable`` should be called in your script's main file and execute all of your tasks. If your scripts are big enough you may encapsulate every task in it's own file.

## API

### exec

Executes the given command(s) using node's integrated ``require("child_process").exec`` function.

```js
exec(commands, [options])
```

**Arguments**

``commands: [String | Array<String>]`` The command to be executed. If an array is given, all commands in that array will be executed in order.

```js
options: {
    // If set to true, any error throws while exeuting the command(s) will be ignored
    skipErrors: Boolean
}
```

**Example**

```js
// Single command
await exec("git init")

// Multiple commands and ignoring errors
await exec([
    "git add .",
    "git commit -m \"my commit message\"",
    "git push"
], { skipErrors: true })
```

### run

Runs an (asynchronous) function and displays a spinner and the execution time.

```js
run(fn, title)
```

**Arguments**

``fn: Function`` The function to be executed

``title: String`` The text shown in the terminal while the function is running

**Example**

```js
run(createGitRepo, "Create git repository")

async function createGitRepo() {
    await exec("git init")
}
```

### makeRunnable

Creates a function which executes the given function and provides statistics.

```js
makeRunnable(fn) -> Function
```

**Arguments**

``fn: Function`` The function to be executed and messured

**Example**

```js
makeRunnable(async () => {
    await run(createGitRepo, "Create git repository")

    await run(removeGitRepo, "Remove git repository")
})()
```