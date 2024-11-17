import {SourceFile} from "ts-morph";
import {CIP57Blueprint} from "./types/CIP57-Blueprint";
import $RefParser from "@apidevtools/json-schema-ref-parser";

export function addMeshJsDataImportToFile(sourceFile : SourceFile) {
    sourceFile.addImportDeclaration({
        moduleSpecifier: "@meshsdk/core",
        namedImports: ["Data", "mConStr"]
    })
}

export async function loadBlueprint(path: string): Promise<CIP57Blueprint> {
    return await $RefParser.dereference(path);
}

export function capitalizeFirstLetter(val: string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}