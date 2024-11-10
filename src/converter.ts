// write top level converter function
import {CodeBlockWriter, InterfaceDeclaration, PropertySignature, SourceFile} from "ts-morph";
import {GeneratorDocEnum} from "./types/GeneratorDocEnum";
import {addMeshJsDataImportToFile} from "./util";

/**
 * Write the converter function to the source file for the given interface declaration
 * @param sourceFile
 * @param interfaceDecl
 * @param functionName
 */
export function writeConverter(sourceFile: SourceFile, interfaceDecl: InterfaceDeclaration, functionName: string) {
    // Here we need to add the converter Function to MeshJS Data
    addMeshJsDataImportToFile(sourceFile);

    sourceFile.addFunction({
        name: functionName,
        parameters: [{name: "data", type: interfaceDecl.getName()}],
        returnType: "Data",
        isExported: true,
        statements: writer => {
            const properties = interfaceDecl.getProperties();
            if(properties.length === 0) {
                writer.write("return [];");
                return;
            } else {
                writer.write("return ");
                if(properties.length > 1) {
                    writer.write("{fields:[");
                }
                for(let i = 0; i < properties.length; i++) {
                    const docs = properties[i].getJsDocs().map(value => value.getInnerText());

                    handlePrimitivProperty(docs, writer, properties, i);

                    i = handleConstructorProperties(docs, writer, properties, i);
                }
                if(properties.length > 1) {
                    writer.write("]} as Data;");
                } else {
                    writer.write(";");
                }
            }
        }
    });
}

function handlePrimitivProperty(docs: string[], writer: CodeBlockWriter, properties: PropertySignature[], i: number) {
    const value = properties[i];
    if (docs.includes(GeneratorDocEnum.PRIMITIVE)) {
        writer.writeLine("data." + value.getName() + (properties.length > 1 ? "," : ""));
    }
}

function handleConstructorProperties(docs: string[], writer: CodeBlockWriter, properties: PropertySignature[], i: number) {
    if (docs.includes(GeneratorDocEnum.CONSTRUCTOR)) {
        // check if there are multiple possible constructors by checking if the following indexes are increments of the current index
        let indexNameTuple: [number, string][] = [[Number(properties[i].getJsDocs().reverse()[0].getInnerText()), properties[i].getName()]];
        let currentIndex = indexNameTuple[0][0];
        // collect all the constructors that are in sequence
        while (i + 1 < properties.length) {
            // check if the next property is a constructor and the index is the next increment
            // if it is, add it to the indexNameTuple and increment the currentIndex and i
            // if it is not, break the loop
            if (properties[i + 1].getJsDocs().map(value => value.getInnerText()).includes(GeneratorDocEnum.CONSTRUCTOR)
                && Number(properties[i + 1].getJsDocs().reverse()[0].getInnerText()) === currentIndex + 1) {
                indexNameTuple.push([Number(properties[i + 1].getJsDocs().reverse()[0].getInnerText()), properties[i + 1].getName()]);
                i++;
                currentIndex++;
            } else {
                break;
            }
        }
        // if there is only one constructor, we can just call the constructor function
        if (indexNameTuple.length === 1) {
            const value = indexNameTuple[0];
            writer.writeLine("mConStr(" + value[0] + ", [" + value[1] + "ToData(data." + value[1] + ")])" + (properties.length > 1 ? "," : ""));
        } else {
            indexNameTuple.forEach(value => {
                writer.writeLine("data." + value[1] + " !== undefined ? mConStr(" + value[0] + ", [" + value[1] + "ToData(data." + value[1] + ")]) : ");
            });
            writer.writeLine("null,");
        }
    }
    return i;
}