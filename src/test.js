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