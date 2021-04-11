import fs from "fs";
import path from "path";
import MapParser from "../MapParser";
import expectedResult from "../../../examples/expected_a_hallo_cmake_sections.json";

// changed, value of .init_array => issue parsing address without size
import bigExpectedSections from "../../../examples/cmake_output_sections.json";

test("test parse big output.map file", () => {
  MapParser.TurnOnAMPEquality = true;
  let fileBuffer = fs.readFileSync(
    path.join(__dirname, "./../../../examples/", "cmake_output.map.p1")
  );
  let content = fileBuffer.toString("utf-8");
  fileBuffer = fs.readFileSync(
    path.join(__dirname, "./../../../examples/", "cmake_output.map.p2")
  );
  content += fileBuffer.toString("utf-8");

  const parser = new MapParser();
  parser.parse(content);

  const sectionArray = Object.keys(parser.Sections).map(
    (k) => parser.Sections[k]
  );

  expect(sectionArray.length).toBe(bigExpectedSections.length);

  const a = sectionArray.sort((a, b) => ("" + a.Name).localeCompare(b.Name));
  const b = bigExpectedSections.sort((a, b) =>
    ("" + a[0]).localeCompare(b[0] + "")
  );

  // expect(a.flatMap((s) => [s.Name])).toEqual(b.flatMap((v) => v[0]));

  expect(a.map((s) => [s.Name, s.NumRecords])).toEqual(
    b.map((s) => [s[0], s[3]])
  );

  const archives_array = Object.keys(parser.Archives);
  expect(archives_array.length).toBe(15);
});

test("test parse hello-world example file to object", () => {
  // cross check with amp.exe implementation results
  MapParser.TurnOnAMPEquality = true;

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

  const a = sectionArray.sort((a, b) => ("" + a.Name).localeCompare(b.Name));
  const b = expectedResult.sort((a, b) => ("" + a[0]).localeCompare(b[0] + ""));

  expect(a.flatMap((s) => [s.Name])).toEqual(b.flatMap((v) => v[0]));

  expect(sectionArray.length).toBe(expectedResult.length);

  // current issue, amp.exe does not recognize all
  expect(a.map((s) => [s.Name, s.NumRecords])).toEqual(
    b.map((s) => [s[0], s[3]])
  );

  // WIP: implement archive array
  expect(parser.Archives).toEqual({
    "/usr/lib/x86_64-linux-gnu/libc_nonshared.a": {
      File: "/usr/lib/x86_64-linux-gnu/libc_nonshared.a",
      NumRecords: 1,
      Archives: [
        {
          FileLocation: "/usr/lib/x86_64-linux-gnu/libc_nonshared.a",
          CompilationUnit:
            "/usr/lib/gcc/x86_64-linux-gnu/9/../../../x86_64-linux-gnu/Scrt1.o",
          SymbolCall:
            "(__libc_csu_init) (cmsys::RegularExpression::RegularExpression(cmsys::RegularExpression const&))",
          Symbol: "elf-init.oS",
        },
      ],
    },
  });
});
