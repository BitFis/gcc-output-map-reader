import fs from "fs";
import path from "path";
import MapParser from "../MapParser";
import expectedResult from "../../../examples/expected_a_hallo_cmake_sections.json";

test("test parse hello-world example file to object", () => {
  // const content = fs.readFileSync(path.join(__dirname, "./../../../examples/", "cmake_output.map"));
  const content = fs.readFileSync(
    // path.join(__dirname, "./../../../examples/", "cmake_output.map")
    path.join(__dirname, "./../../../examples/", "a_hello_cmake_small.map")
  );

  const parser = new MapParser();

  parser.parse(content.toString("utf-8"));

  const sectionArray = Object.keys(parser.Sections).map(
    (k) => parser.Sections[k]
  );

  expect(sectionArray.length).toBe(74);

  let a = sectionArray.sort((a, b) => ("" + a.Name).localeCompare(b.Name));
  let b = expectedResult.sort((a, b) => ("" + a[0]).localeCompare(b[0] + ""));

  expect(a.flatMap((s) => [s.Name])).toEqual(b.flatMap((v) => v[0]));

  expect(sectionArray.length).toBe(expectedResult.length);

  a = a.map((s) => [s.Name, s.NumRecords]);
  b = b.map((s) => [s[0], s[3]]);

  console.log(a);

  return;

  // WIP:
  expect(a).toEqual(b);

  // check componenten number
});
