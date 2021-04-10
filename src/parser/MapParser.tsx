interface SubSectionSpace {
  MangledName: string;
  AddressStart: number;
}

class SubSection {
  public Additonal: string[] = []; // valid but not specifically parser
  // *(.xyz) options or *fill* -> not further processed for now
  // mangledSubsectionContent
  public MangledList: SubSectionSpace[] = [];
  // -1 = undefined
  public AddressSpaceSize = -1;

  constructor(
    public Section: string, // Section name
    public Name: string, // Subsection name
    public StartAddress: number, // Start address
    public Size: number, // Size of subsection
    public FileName: string // Filename
  ) {}

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
    const tmp_remove_me = ".no_match_data";

    //                         [space]   [* or space]
    //                                if [---space--] [0x-address--------] [--mangaled name-]
    //                                if [*][--some--additonal-info-(*fill* or *(.))---]
    // eslint-disable-next-line
    const SUBSECTION_CONTENT = /\n[^\.\n](\*[^\n]*| +)(0x[0-9a-fA-F]+|[^ ]+)? *([^\n]*)/gm;

    if (this.Section == tmp_remove_me) {
      console.log(subsection_content);
    }

    let match;
    let counter = 0;
    let dontCountAnyFollowUp = false;

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
            this.MangledList.push({
              AddressStart: parseInt(addressStart, 16),
              MangledName: mangaledName,
            });

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

        if (tmp_remove_me == this.Section) {
          console.log(
            "I>",
            this.Section,
            this.Name,
            addressStart,
            "|",
            match[3]
          );
        }
      } else {
        console.log(
          `Potential SubSection parse issue in ${this.Section}:${this.Name} - strange start: '${identifier}' (expected * or ' ')`,
          subsection_content
        );
      }

      // check valid address space
    }

    if (this.Section == tmp_remove_me) {
      console.log("END", this.Section, counter);
    }

    return counter;
  }
}

interface Archive {
  Sumbol: string;
  FileLocation: string;
  CompilationUnit: string;
  SymbolCall: string;
}

class Section {
  public NumRecords = 0;
  // calculated length of address space to next sector
  public AddressSpaceSize = 0;

  constructor(
    public Name: string, //
    public StartAddress: number,
    public Size: number
  ) {}

  parse(section_content: string): SubSection[] {
    // regex::             [subsection] [0xaddress space] [    0xsize    ]  [ subsection valid aslong '\n ^.' ]
    // eslint-disable-next-line
    const SUBSECTION_REGEX = / (\.[^ \t\n]+)\n? +(0x[0-9a-fA-F]+) +(0x[0-9a-fA-F]+) ?([^\n]+)?((\n [^\.][^\n]*)*)/gm;

    // result NumRecords
    // WIP
    // console.log("parse for section: ", this.Name);

    const subSectionsList: SubSection[] = [];
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
        subsection,
        address,
        size,
        fileName
      );
      if (match[5]) {
        subSection.parse(match[5]);
      }
      subSectionsList.push(subSection);

      this.NumRecords += subSection.getNumRecords();
    }

    // WIP possible to extend, matching regions with *(.ldata / )
    return subSectionsList;
  }

  append(section: Section) {
    // WIP
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

class MapParser {
  private currentPos = 0;

  // Wip, currently, since some stats are handled differently
  // in the AMAP editor, and it is used as cross testing (expecting at least same results)
  // this allows to turn "backward" compability on for correctness checking.
  public static TurnOnAMPEquality = false;

  // length of hex address representation, will help parsing
  public static ADDRESS_HEX_LENGTH = 18;

  private SECTION_MATCHER = /(\n(\.[^ \n\t]+)\n? *(0x[0-9a-fA-F]+)? *(0x[0-9a-fA-F]+)?([^\n]*(\n [^\n]*)*))/gm;

  public Sections: {
    [key: string]: Section;
  } = {};
  public Archives: {
    [CompilationUnit: string]: Archive;
  } = {};

  private parseSectionMatch(match: RegExpExecArray) {
    if (match.length <= 5) {
      console.log(
        `parser error at: ${match.index} ${this.SECTION_MATCHER.lastIndex}`
      );
      return;
    }

    if (match.length >= 4) {
      const name = match[2];
      const hexaddr = match[3]?.slice(2);
      const hexsize = match[4]?.slice(2);

      if (!name || (!hexaddr && hexsize) || (hexaddr && !hexsize)) {
        console.warn(
          `possible parsing error at character ${match.index} - ${this.SECTION_MATCHER.lastIndex}`
        );
        return;
      }

      const section = new Section(
        name,
        hexaddr ? parseInt(hexaddr, 16) : 0,
        hexsize ? parseInt(hexsize, 16) : 0
      );
      section.parse(match[5]);
      if (this.Sections[name]) {
        this.Sections[name].append(section);
      } else {
        this.Sections[name] = section;
      }
    } else {
      console.log(
        `parser error at: ${match.index} ${this.SECTION_MATCHER.lastIndex}`
      );
    }
  }

  parse(content: string): void {
    const regexp = this.SECTION_MATCHER;

    let match: RegExpExecArray | null;
    while ((match = regexp.exec(content)) !== null) {
      const identifier = match[2];

      if (identifier.startsWith(".")) {
        // section
        this.parseSectionMatch(match);
      }
    }
  }
}

export default MapParser;
