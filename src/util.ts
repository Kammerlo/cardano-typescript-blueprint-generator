import {SourceFile} from "ts-morph";

export function addMeshJsDataToFile(sourceFile : SourceFile) {
    sourceFile.addImportDeclaration({
        moduleSpecifier: "@meshsdk/core",
        namedImports: ["Data", "mConStr"]
    })
}