#! /usr/bin/env node
import {processBlueprint, processBlueprintByFilePath} from "./blueprint";
import {Command} from "commander";
const figlet = require('figlet');
const pj = require('./../package.json');

const program = new Command();

console.log(figlet.textSync('Cardano Blueprint Generator'));

program
    .version(pj.version)
    .description('Generate Cardano Blueprint classes from a JSON file')
    .argument('<file>', 'Path to the JSON blueprint file')
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
if (options.output) {
    const path = typeof options.output === "string" ? options.output : __dirname;
    console.log("Output path: " + path);
    processBlueprintByFilePath(filePath, path);
} else {
    processBlueprintByFilePath(filePath);
}