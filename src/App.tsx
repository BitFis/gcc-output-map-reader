import { SyntheticEvent, useEffect, useState, VFC } from "react";
import "./App.css";
import {
  Box,
  Container,
  Tab,
  Tabs,
  Typography,
  Skeleton,
  IconButton,
} from "@material-ui/core";
import Table from "./ui/Table";
import OutputDrop from "./ui/OutputDrop";
import { TCell } from "gridjs/dist/src/types";
import { TabContext, TabPanel } from "@mui/lab";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ObjData from "./parser/MapParser";
import Timer from "./utils/Timer";
import Formatter from "./utils/Formatter";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const TableSkeleton: VFC = () => {
  return (
    <div>
      <Skeleton animation={false} height={64} />
      <Skeleton variant="rectangular" animation={false} height={500} />
    </div>
  );
};

type ModulesTableColumns = {
  Module: string;
  "Size no .bss": number;
  Size: number;
  "Num of records": number;
};
type ByFilesTableColumns = {
  File: string;
} & ModulesTableColumns;
const ModulesTableColumnsOrder = [
  "Module",
  "Size no .bss",
  {
    name: "Size",
    formatter: (cell: TCell) => Formatter.Size(cell as number),
  },
  "Num of records",
];

type AllTableColumns = {
  Section: string;
  SubSection: string;
  Address: number;
  AddressHex: string;
  Size: number;
  "Demangled Name": string;
  "Moduled Name": string;
  "File Name": string;
  "Mandled Name": string;
};
const AllTableColumnsOrder = [
  "Section",
  "SubSection",
  "AddressHex",
  {
    name: "Size",
    formatter: (cell: TCell) => Formatter.Size(cell as number),
  },
  "Demangled Name",
  "Moduled Name",
  "File Name",
  "Mandled Name",
];

type TableContentType = string | number;

class DataTableArray<T extends Record<string, TableContentType>> {
  Items: TableContentType[][] = [];

  constructor(public ColumnsOrder: string[]) {}

  add(insert: T) {
    const sorted: TableContentType[] = [];
    this.ColumnsOrder.forEach((c) => {
      sorted.push(insert[c]);
    });
    this.Items.push(sorted);
  }
}

const formatToHex = (number: number) => {
  return "0x" + `0000000000000000${number.toString(16)}`.slice(-16);
};

const App: VFC = () => {
  const [value, setValue] = useState("all");

  const [allData, setAllData] = useState<TableContentType[][]>([]);
  const [allModules, setAllModules] = useState<TableContentType[][]>([]);

  const [data, setData] = useState<ObjData>(new ObjData());

  useEffect(() => {
    fillDatabase(data);
  }, [data]);

  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const fillDatabase = (parser: ObjData) => {
    const timer = new Timer();
    console.debug("Start preparing database");

    const all = new DataTableArray<AllTableColumns>(
      // eslint-disable-next-line
      AllTableColumnsOrder.map((c: any) => {
        return c.name || c;
      })
    );
    const allModules = new DataTableArray<ModulesTableColumns>(
      // eslint-disable-next-line
      ModulesTableColumnsOrder.map((c: any) => {
        return c.name || c;
      })
    );
    // const byfiles = new

    const notPartOfArchive: ModulesTableColumns = {
      "Num of records": 0,
      "Size no .bss": -1,
      Module: "",
      Size: 0,
    };
    const Archives: { [key: string]: ByFilesTableColumns } = {};
    Object.keys(parser.Archives).forEach((k) => {
      Archives[k] = {
        "Num of records": 0,
        "Size no .bss": -1,
        Module: k,
        Size: 0,
        File: parser.Archives[k].File,
      };
    });

    // fill all view data
    // Wip fill module / archive categorization
    Object.keys(parser.Sections).forEach((sectionKey) => {
      parser.Sections[sectionKey].SubSectionsList.forEach((subSections) => {
        const insert: AllTableColumns = {
          "Demangled Name": "",
          "File Name": subSections.FileName,
          "Mandled Name": subSections.Mangled.replace(/$\.(text|data)/g, ""),
          Address: subSections.StartAddress,
          AddressHex: formatToHex(subSections.StartAddress),
          Section: subSections.Section,
          SubSection: subSections.Name,
          Size: subSections.Size,
          "Moduled Name": "",
        };

        // WIP, move to parsing process??
        // select archive for process
        let partOfModule: ModulesTableColumns = Archives[subSections.FileName];
        if (!partOfModule) {
          partOfModule = notPartOfArchive;
        }

        partOfModule.Size += subSections.Size;

        if (subSections.MangledList.length > 0) {
          subSections.MangledList.forEach((mangled) => {
            insert["Mandled Name"] = mangled.MangledName;
            insert.Size = mangled.Size;

            insert.Address = mangled.AddressStart;
            insert.AddressHex = formatToHex(mangled.AddressStart);
            all.add(insert);

            if (mangled.Size > 0) {
              partOfModule["Num of records"]++;
            }
          });
        } else {
          if (subSections.Size > 0) {
            partOfModule["Num of records"]++;
          }

          all.add(insert);
        }
      });
    });

    allModules.add(notPartOfArchive);
    Object.keys(Archives).forEach((key) => {
      // modules.add(Archives[key]) => byFile
      allModules.add({
        "Num of records": Archives[key]["Num of records"],
        "Size no .bss": Archives[key]["Size no .bss"],
        Module: Archives[key].Module,
        Size: Archives[key].Size,
      });
    });

    //console.log("res ...", parser.Archives);
    setAllData(all.Items);
    setAllModules(allModules.Items);

    console.debug(`Database views prepared ${timer.Format()}`);
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          <IconButton href="./gcc-output-map-web-renderer.zip">
            <CloudDownloadIcon color="action" />
          </IconButton>
          output.map viewer
        </Typography>

        <OutputDrop OnLoaded={setData} />

        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="Data analyze section"
            >
              <Tab label="All" value="all" {...a11yProps(0)} />
              <Tab label="By Module" value="by_module" {...a11yProps(1)} />
              <Tab label="By File (WIP)" value="by_file" {...a11yProps(2)} />
              <Tab
                label="By Section (WIP)"
                value="by_section"
                {...a11yProps(3)}
              />
              <Tab
                label="By SubSection (WIP)"
                value="by_subsection"
                {...a11yProps(4)}
              />
            </Tabs>
          </Box>
          <TabPanel value="all">
            <Table data={allData} columns={AllTableColumnsOrder} />
          </TabPanel>
          <TabPanel value="by_module">
            <Table data={allModules} columns={ModulesTableColumnsOrder} />
          </TabPanel>
          <TabPanel value="by_file">
            <TableSkeleton />
          </TabPanel>
          <TabPanel value="by_section">
            <TableSkeleton />
          </TabPanel>
          <TabPanel value="by_subsection">
            <TableSkeleton />
          </TabPanel>
        </TabContext>
      </Box>
    </Container>
  );
};

export default App;
