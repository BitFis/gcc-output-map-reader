import { SyntheticEvent, useState, VFC } from "react";
import "./App.css";
import {
  Box,
  Container,
  Tab,
  Tabs,
  Typography,
  Skeleton,
} from "@material-ui/core";
import Table from "./ui/Table";
import { TabContext, TabPanel } from "@material-ui/lab";
import OutputDrop from "./ui/OutputDrop";
import MapParser from "./parser/MapParser";

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

type AllTableColumns = {
  Section: string;
  SubSection: string;
  Address: number;
  Size: number;
  "Demangled Name": string;
  "Moduled Name": string;
  "File Name": string;
  "Mandled Name": string;
};
const AllTableColumnsOrder = [
  "Section",
  "SubSection",
  "Address",
  "Size",
  "Demangled Name",
  "Moduled Name",
  "File Name",
  "Mandled Name",
];

type TableContentType = string | number;

class DataTableArray<T extends Record<string, TableContentType>> {
  Items: TableContentType[][] = [];

  add(insert: T) {
    const sorted: TableContentType[] = [];
    AllTableColumnsOrder.forEach((c) => {
      sorted.push(insert[c]);
    });
    this.Items.push(sorted);
  }
}

const App: VFC = () => {
  const [value, setValue] = useState("all");

  const [allData, setAllData] = useState<TableContentType[][]>([]);

  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const fillDatabase = (parser: MapParser) => {
    const all = new DataTableArray<AllTableColumns>();
    // fill all

    // Wip fill module / archive categorisation
    Object.keys(parser.Sections).forEach((sectionKey) => {
      parser.Sections[sectionKey].SubSectionsList.forEach((subSections) => {
        const insert: AllTableColumns = {
          "Demangled Name": "",
          "File Name": subSections.FileName,
          "Mandled Name": subSections.Mangled.replace(/$\.(text|data)/g, ""),
          Address: subSections.StartAddress,
          Section: subSections.Section,
          SubSection: subSections.Name,
          Size: subSections.Size,
          "Moduled Name": "",
        };

        if (subSections.MangledList.length > 0) {
          subSections.MangledList.forEach((mangled) => {
            insert["Mandled Name"] = mangled.MangledName;
            insert.Size = insert.Address;
            insert.Address = mangled.AddressStart;
            all.add(insert);
          });
          // insert mangled info
        } else {
          all.add(insert);
        }
      });
    });

    all.add({
      Address: 318,
      Size: 28,
      SubSection: ".interopt",
      Section: ".interopt",
      "Demangled Name": "",
      "Moduled Name": "",
      "File Name":
        "/usr/lib/gcc/x86_64-linux-gnu/9/../../../x86_64-linux-gnu/Scrt1.o",
      "Mandled Name": "",
    });

    //console.log("res ...", parser.Archives);
    setAllData(all.Items);
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          output.map viewer
        </Typography>

        <OutputDrop OnLoaded={fillDatabase} />

        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="All (DEMO)" value="all" {...a11yProps(0)} />
              <Tab
                label="By Module (WIP)"
                value="by_module"
                {...a11yProps(1)}
              />
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
            <TableSkeleton />
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
