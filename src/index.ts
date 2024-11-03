#! /usr/bin/env node
import {processBlueprint} from "./blueprint";
import {Command} from "commander";
const figlet = require('figlet');
const pj = require('./../package.json');

const program = new Command();

console.log(figlet.textSync('Cardano Blueprint Generator'));

program
    .version(pj.version)
    .description('Generate Cardano Blueprint classes from a JSON file')
    .command('<file>', 'Path to the JSON blueprint file')
    .option('-o --output <path>', 'Path to the JSON blueprint file, default output is ./generated')
    .parse(process.argv);

const options = program.opts();
if (program.args.length === 0) {
    program.outputHelp();
    process.exit(1);
}

if (program.args.length > 1) {
    console.error("Too many arguments");
    process.exit(1);
}

const filePath = program.args[0];

if (options.file) {
    const path = typeof options.file === "string" ? options.file : __dirname;
    processBlueprint(filePath, path);
} else {
    processBlueprint(filePath);
}