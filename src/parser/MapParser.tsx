class SubSection {
  constructor(
    public Section: string,
    public Name: string, //
    public StartAddress: number,
    public Size: number,
    public FileName: string
  ) {}
}

class Section {
  public NumRecords = 0;

  constructor(
    public Name: string, //
    public StartAddress: number,
    public Size: number
  ) {}

  parse(section_content: string) {
    // regex::             [subsection] [0xaddress space] [    0xsize    ]  [ subsection valid aslong '\n ^.' ]
    // eslint-disable-next-line
    const SUBSECTION_REGEX = / (\.[^ \t]+) +(0x[0-9a-zA-Z]+) +(0x[0-9a-zA-Z]+) ?([^\n]+)?(\n [^\.][^\n]*)*/gm;

    // result NumRecords
    // WIP
    // console.log("parse for section: ", this.Name);

    let match;

    if (this.Name == ".init_array") {
      console.log(section_content);
    }

    while ((match = SUBSECTION_REGEX.exec(section_content)) != null) {
      const subsection = match[1];
      const address = match[2] ? parseInt(match[2]) : 0;
      const size = match[3] ? parseInt(match[3]) : 0;
      const fileName = match[4];

      // TMP -> "only allow paths starting with /"
      // (can be changed back later till get same result as amap.exe)
      if (!fileName.startsWith("/")) continue;

      // WIP
      new SubSection(this.Name, subsection, address, size, fileName);

      if (size > 0) {
        this.NumRecords++;
      }
    }

    // WIP possible to extend, matching regions with *(.ldata / )
  }

  append(section: Section) {
    // WIP
    if (this.StartAddress == 0) {
      this.StartAddress = section.StartAddress;
    } else if (section.StartAddress != 0) {
      console.log(
        `undefined behaviour, joining section ${section.Name} - address`
      );
    }
    if (this.Size == 0) {
      this.Size = section.Size;
    } else if (section.Size != 0) {
      console.log(
        `undefined behaviour, joining section ${section.Name} - size`
      );
    }
    if (this.NumRecords == 0) {
      this.NumRecords = section.NumRecords;
    } else if (section.NumRecords != 0) {
      console.log(
        `undefined behaviour, joining section ${section.Name} - containing records`
      );
    }
  }
}

class MapParser {
  private currentPos = 0;

  private SECTION_MATCHER = /\n(\.[^ \n\t]+)\n? *(0x[0-9a-zA-Z]+)? *(0x[0-9a-zA-Z]+)?([^\n]*(\n [^\n]*)*)/gm;

  public Sections: {
    [key: string]: Section;
  } = {};

  parse(content: string): void {
    const regexp = this.SECTION_MATCHER;

    let match: RegExpExecArray | null;
    while ((match = regexp.exec(content)) !== null) {
      if (match.length <= 4) {
        console.log(
          `parser error at: ${match.index} ${this.SECTION_MATCHER.lastIndex}`
        );
        continue;
      }

      if (match.length >= 3) {
        const name = match[1];
        const hexaddr = match[2]?.slice(2);
        const hexsize = match[3]?.slice(2);

        if (!name || (!hexaddr && hexsize) || (hexaddr && !hexsize)) {
          console.warn(
            `possible parsing error at character ${match.index} - ${this.SECTION_MATCHER.lastIndex}`
          );
          continue;
        }

        const section = new Section(
          name,
          hexaddr ? parseInt(hexaddr, 16) : 0,
          hexsize ? parseInt(hexsize, 16) : 0
        );
        section.parse(match[4]);
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
  }
}

export default MapParser;
