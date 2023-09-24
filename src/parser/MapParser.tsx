interface SubSectionSpace {
  MangledName: string;
  AddressStart: number;
  Size: number;
}

// WIP: Use Worker in the future
async function refreshUI() {
  await new Promise((r) => setTimeout(r, 0));
}

class SubSection {
  public Additonal: string[] = []; // valid but not specifically parser
  // *(.xyz) options or *fill* -> not further processed for now
  // mangledSubsectionContent
  public MangledList: SubSectionSpace[] = [];
  // -1 = undefined
  public AddressSpaceSize = -1;

  public Name: string;
  public Mangled = "";
  public FileName = "";
  public Module = "";

  constructor(
    public Section: string, // Section name
    public FullName: string, // Subsection name
    public StartAddress: number, // Start address
    public Size: number, // Size of subsection
    public FullFileName: string // Filename
  ) {
    // eslint-disable-next-line
    const subModuleName = /([^\(]+)\(([^\)]+)/g.exec(FullFileName);
    if (subModuleName) {
      this.FileName = subModuleName[1] || FullFileName;
      this.Module = subModuleName[2] || "";
    } else {
      this.FileName = FullFileName;
    }

    // eslint-disable-next-line
    const subSectionSplit = /(\.[^\.]+)(.*)/g.exec(FullName);
    if (subSectionSplit) {
      this.Name = subSectionSplit[1] || "";
      this.Mangled = subSectionSplit[2] || "";
    } else {
      this.Name = FullName;
    }
  }

  getNumRecords(): number {
    let count = 0;
    if (this.Size > 0) {
      count += 1;
      if (this.MangledList.length > 0) {
        // counts any number of records (if mangled name uses own address space)
        this.MangledList.sort((a, b) => {
          return a.AddressStart - b.AddressStart;
        }).reduce((last, item) => {
          if (last.AddressStart != item.AddressStart) {
            count++;
          }
          return item;
        });
      }
    }
    return count;
  }

  /**
   * Parse subsection content and return number of child sections
   */
  parse(subsection_content: string): number {
    //                         [space]   [* or space]
    //                                if [---space--] [0x-address--------] [--mangaled name-]
    //                                if [*][--some--additonal-info-(*fill* or *(.))---]
    // eslint-disable-next-line
    const SUBSECTION_CONTENT = /\n[^\.\n](\*[^\n]*| +)(0x[0-9a-fA-F]+|[^ ]+)? *([^\n]*)/gm;

    let match;
    let counter = 0;
    let dontCountAnyFollowUp = false;
    // used to calculate size
    let lastAddress = 0;
    let totalInnerSize = 0;

    while ((match = SUBSECTION_CONTENT.exec(subsection_content)) != null) {
      const identifier = match[1];

      if (!identifier) {
        console.log(
          `Potential SubSection parse issue in ${this.Section}:${this.Name}`,
          subsection_content
        );
        continue;
      }

      if (identifier.startsWith("*")) {
        // found additonal content
        this.Additonal.push(identifier);
      } else if (identifier.trim() === "") {
        const addressStart = match[2];
        const mangaledName = match[3] ? match[3] : "";

        // check valid hex
        if (/^0x([0-9a-fA-F])+$/.test(addressStart)) {
          // (REFACTOR: cleaner regex needed for identifing)
          // check if address or size
          if (addressStart.length == MapParser.ADDRESS_HEX_LENGTH) {
            // it is an actual address space
            const address = parseInt(addressStart, 16);
            let size = 0;
            if (this.MangledList.length > 0) {
              size = address - lastAddress;
            }
            address - lastAddress;
            this.MangledList.push({
              AddressStart: parseInt(addressStart, 16),
              MangledName: mangaledName,
              Size: size,
            });
            lastAddress = address;
            totalInnerSize += size;

            // used for amax.exe
            if (!dontCountAnyFollowUp) {
              counter += 1;
            }
          } else {
            // it is the size representation
            // WIP, what todo
          }
        } else {
          // no valid hex provided,
          // this could be [!provide] value, lets just ignore but inform if not [!provide] - provide can be expected
          if ("[!provide]" !== addressStart.trim()) {
            console.debug(
              `Ignoring SubSection content '${addressStart}' in ${this.Section}:${this.Name}`,
              subsection_content
            );
          }
          // TMP: compatible with AMP.exe
          dontCountAnyFollowUp = true;
          continue;
        }
      } else {
        console.log(
          `Potential SubSection parse issue in ${this.Section}:${this.Name} - strange start: '${identifier}' (expected * or ' ')`,
          subsection_content
        );
      }

      // check valid address space
    }

    // set size of first element
    if (this.MangledList.length > 0) {
      if (this.Size - totalInnerSize < 0) {
        console.error(
          `Issue while parsing, got negative number? ${
            this.Size
          } - ${totalInnerSize} = ${this.Size - totalInnerSize}`,
          this
        );
      } else {
        this.MangledList[0].Size = this.Size - totalInnerSize;
      }
    }

    return counter;
  }
}

interface Archive {
  Symbol: string;
  FileLocation: string;
  CompilationUnit: string;
  SymbolCall: string;
}

interface ArchiveFile {
  File: string;
  NumRecords: number;
  Archives: Archive[];
}

export class Section {
  public NumRecords = 0;
  // calculated length of address space to next sector
  public AddressSpaceSize = 0;
  public SubSectionsList: SubSection[] = [];

  constructor(
    public Name: string, //
    public StartAddress: number,
    public Size: number
  ) {}

  parse(section_content: string, mapParser: MapParser): SubSection[] {
    // regex::             [subsection] [0xaddress space] [    0xsize    ]  [ subsection valid aslong '\n ^.' ]
    // eslint-disable-next-line
    const SUBSECTION_REGEX = / (\.[^ \t\n]+|COMMON)\n? +(0x[0-9a-fA-F]+) +(0x[0-9a-fA-F]+) ?([^\n]+)?((\n [^\.*][^\n]*)*)/gm;

    // result NumRecords
    // WIP
    // console.log("parse for section: ", this.Name);

    let match;

    while ((match = SUBSECTION_REGEX.exec(section_content)) != null) {
      const subsection = match[1];
      const address = match[2] ? parseInt(match[2]) : 0;
      const size = match[3] ? parseInt(match[3]) : 0;
      const fileName = match[4];

      // Amp.exe -> "only allow paths starting with /"
      // for amp.exe equality.
      // if (!fileName.startsWith("/")) {
      //   continue;
      // }

      // WIP add to somewhere
      const subSection = new SubSection(
        this.Name,
        subsection.replace(/\.text.+/, ""),
        address,
        size,
        fileName
      );
      if (match[5]) {
        subSection.parse(match[5]);
      }
      this.SubSectionsList.push(subSection);
      mapParser.SubSections.push(subSection);

      this.NumRecords += subSection.getNumRecords();

      if (subsection === "COMMON") {
        // remove common record (TMP???)
        this.NumRecords -= 1;
      }
    }

    // WIP possible to extend, matching regions with *(.ldata / )
    return this.SubSectionsList;
  }

  append(section: Section): void {
    if (this.StartAddress == 0) {
      this.StartAddress = section.StartAddress;
    } else if (section.StartAddress != 0) {
      console.log(
        `undefined behaviour, joining section ${section.Name} - section exists twice with a address`
      );
    }
    if (this.Size == 0) {
      this.Size = section.Size;
    } else if (section.Size != 0) {
      console.log(
        `undefined behaviour, joining section ${section.Name} - section exists twice with a size`
      );
    }
    if (this.NumRecords == 0) {
      this.NumRecords = section.NumRecords;
    } else if (section.NumRecords != 0) {
      console.log(
        `undefined behaviour, joining section ${section.Name} - containing records twice`
      );
    }
  }
}

type SegmentParseFunction = (
  match: RegExpExecArray,
  regex: RegExp,
  mapParser: MapParser
) => void;

interface SegmentInfo {
  Regex: RegExp;
  ParseFunction?: SegmentParseFunction;
  activeSegment?: string;
}

class ObjData {
  public Archives: {
    [ArchiveFile: string]: ArchiveFile;
  } = {};
  public Sections: {
    [key: string]: Section;
  } = {};
}

class MapParser extends ObjData {
  private currentPos = 0;

  // Wip, currently, since some stats are handled differently
  // in the AMAP editor, and it is used as cross testing (expecting at least same results)
  // this allows to turn "backward" compability on for correctness checking.
  public static TurnOnAMPEquality = false;

  // length of hex address representation, will help parsing
  public static ADDRESS_HEX_LENGTH = 18;

  // match hex storage address (0xADDRESS(8+))
  public static ADDRESS_MATCHER = `(0x[0-9a-fA-F]{8,})`;
  // match section size (0xHEX)
  public static SECTION_SIZE_MATCHER = `(0x[0-9a-fA-F]+)`;

  // Be aware, for string regex, following need a '\' otherwise default string will be used:
  //-> \. => \\. (enforce . match)
  //-> \t => \\t (enforce tab match)

  //                             [----section-------] [--0x address----] [---size (opt)--] [---anything till double \n\n-]
  // eslint-disable-next-line
  public static SECTION_REGEX = `\n(\\.[^ \n\\t]+)\n? *${MapParser.ADDRESS_MATCHER}? *${MapParser.SECTION_SIZE_MATCHER}?([^\n]*(\n [^\n]*)*)`;

  //                            [archive-path] (-Symbol-)\n  [CompileUnit](--Call--)
  // eslint-disable-next-line
  public static ARCHIVE_REGEX = `\n([^\\(\n ]+)\\(([^\\)]+)\\)\n +([^\n ]+) +([^\n]+)`;

  public static ARCHIVE_START = `Archive member included to satisfy reference by file[^\n]*`;
  public static SECTION_START = `Linker script and memory map[^\n]*`;

  // list of starts of new region within the output.map file
  public static SEGMENT_STARTS_LIST = [
    MapParser.ARCHIVE_START,
    `Merging program properties[^\n]*`,
    `Discarded input sections[^\n]*`,
    `Memory Configuration[^\n]*`,
    MapParser.SECTION_START,
  ];

  public SubSections: SubSection[] = [];

  private parseArchiveMatch(match: RegExpExecArray, regex: RegExp) {
    if (match.length < 4) {
      console.log(
        `Unexpected parsing at character ${match.index} - ${regex.lastIndex}`,
        match[0]
      );
    }

    const key = `${match[1]}`;
    const Archive = {
      CompilationUnit: match[3],
      FileLocation: match[1],
      Symbol: match[2],
      SymbolCall: match[4],
    };

    if (!this.Archives[key]) {
      this.Archives[key] = {
        Archives: [],
        File: Archive.FileLocation,
        NumRecords: 0,
      };
    }

    this.Archives[key].NumRecords++;
    this.Archives[key].Archives.push(Archive);
  }

  private parseSectionMatch(match: RegExpExecArray, regex: RegExp) {
    if (match.length <= 4) {
      console.log(`parser error at: ${match.index} ${regex.lastIndex}`);
      return;
    }

    if (match.length >= 3) {
      const name = match[1];
      const hexaddr = match[2]?.slice(2);
      const hexsize = match[3]?.slice(2);

      if (!name || (!hexaddr && hexsize) || (hexaddr && !hexsize)) {
        console.warn(
          `possible parsing error at character ${match.index} - ${regex.lastIndex}`
        );
        return;
      }

      const section = new Section(
        name,
        hexaddr ? parseInt(hexaddr, 16) : 0,
        hexsize ? parseInt(hexsize, 16) : 0
      );
      section.parse(match[4], this);
      if (this.Sections[name]) {
        this.Sections[name].append(section);
      } else {
        this.Sections[name] = section;
      }
    } else {
      console.log(`parser error at: ${match.index} ${regex.lastIndex}`);
    }
  }

  private getSegmentRegex(segment: string): SegmentInfo {
    const regexList = MapParser.SEGMENT_STARTS_LIST.slice();
    let parseFunction = undefined;
    let activeSegment = undefined;

    if (new RegExp(MapParser.ARCHIVE_START, "g").test(segment)) {
      activeSegment = "ARCHIVE";
      regexList.push(MapParser.ARCHIVE_REGEX);
      parseFunction = this.parseArchiveMatch.bind(this);
    } else if (new RegExp(MapParser.SECTION_START, "g").test(segment)) {
      activeSegment = "SECTION";
      regexList.push(MapParser.SECTION_REGEX);
      parseFunction = this.parseSectionMatch.bind(this);
    } else {
      // WIP, ignore any other segment for now
      // console.debug(`WIP: skip ${segment}`);
    }
    return {
      Regex: new RegExp(`(${regexList.join("|")})`, "gm"),
      ParseFunction: parseFunction,
      activeSegment: activeSegment,
    };
  }

  async parse(content: string): Promise<void> {
    let activeSegment: SegmentInfo = {
      Regex: new RegExp(`(${MapParser.SEGMENT_STARTS_LIST.join("|")})`, "gm"),
      activeSegment: "START",
    };

    let match: RegExpExecArray | null;
    while ((match = activeSegment.Regex.exec(content)) !== null) {
      const next_match = match[2];

      if (next_match) {
        match.shift(); // access actual match

        if (activeSegment.ParseFunction) {
          activeSegment.ParseFunction(match, activeSegment.Regex, this);
        } else {
          console.debug(
            "unexpected match, no parsing function provided",
            match[0]
          );
        }
      } else {
        // replace active regex
        const index = activeSegment.Regex.lastIndex;
        activeSegment = this.getSegmentRegex(match[1]);
        activeSegment.Regex.lastIndex = index;
      }

      // WIP: update state??
      await refreshUI();
    }
  }
}

function parseFile(files: FileList | null): Promise<MapParser> {
  if (files?.length === 1) {
    const file = files.item(0) as File;

    return file.arrayBuffer().then(async (buffer: ArrayBuffer) => {
      let content = "";
      new Uint8Array(buffer).forEach((byte: number) => {
        content += String.fromCharCode(byte);
      });

      const parser = new MapParser();
      await parser.parse(content);
      return parser;
    });
  } else {
    return new Promise((res, rej) => {
      rej("provide one file!");
      console.error(files);
    });
  }
}

export { MapParser, ObjData, parseFile };
