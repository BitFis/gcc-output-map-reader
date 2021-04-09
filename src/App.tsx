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

const App: VFC = () => {
  const [value, setValue] = useState("all");

  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          output.map viewer
        </Typography>
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
            <Table />
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
