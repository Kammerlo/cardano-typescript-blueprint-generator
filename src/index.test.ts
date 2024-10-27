import {expect, test} from "vitest";
import {processBlueprint} from "./blueprint";


test("load Blueprint", () => {
    processBlueprint("./test-data/blueprints/Constructor.json");
})