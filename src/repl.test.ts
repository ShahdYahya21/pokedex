// src/repl.test.ts

import { cleanInput } from "./repl";
import { describe, expect, test } from "vitest";

describe.each([
  { input: "  hello  world  ", expected: ["hello", "world"] },
  { input: "Charmander Bulbasaur PIKACHU", expected: ["charmander", "bulbasaur", "pikachu"] },
  { input: "   Multiple    spaces   here  ", expected: ["multiple", "spaces", "here"] },
  { input: "  SINGLEword ", expected: ["singleword"] },
  { input: "    ", expected: [""] }, // edge case: only whitespace
])("cleanInput('$input')", ({ input, expected }) => {
  test(`should return ${JSON.stringify(expected)}`, () => {
    const actual = cleanInput(input); // call the function
    expect(actual).toHaveLength(expected.length);
    for (const i in expected) {
      expect(actual[i]).toBe(expected[i]);
    }
  });
});
