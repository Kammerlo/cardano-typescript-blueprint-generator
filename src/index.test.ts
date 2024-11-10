import {expect, test} from "vitest";
import {processBlueprintByFilePath} from "./blueprint";


test("load Blueprint", () => {
    processBlueprintByFilePath("./test-data/blueprints/BasicTypesBlueprint.json");
})