const chalk = require("chalk")
const ora = require("ora")
const util = require("util")
const { performance } = require("perf_hooks")

const execAsync = util.promisify(require("child_process").exec)

function round(num, places = 2) {
    return Math.floor(num * (10 ** places)) / (10 ** places)
}

async function exec(command, options) {
    const runCommand = async (command) => {
        const { stderr } = await execAsync(command)

        if (stderr && !(options && options.skipErrors)) {
            throw new Error(stderr)
        }
    }

    if (Array.isArray(command)) {
        for (let c of command) {
            await runCommand(c)
        }
    } else {
        await runCommand(command)
    }
}

async function run(fn, title) {
    const spinner = ora(title).start()
    const startTime = performance.now()

    try {
        await fn()
    } catch (error) {
        spinner.fail()
        throw new Error(error)
    } finally {
        const elapsed = round(performance.now() - startTime)
        spinner.text += ` ${chalk.cyan(elapsed + "ms")}`
    }

    spinner.succeed()
}

function makeRunnable(runTasks = async () => {}) {
    return async () => {
        const startTime = performance.now()

        await runTasks()

        const elapsed = round((performance.now() - startTime) / 1000)
        console.log(chalk.cyan(`Executed in ${elapsed}s`))
    }
}

module.exports = { makeRunnable, run, exec }