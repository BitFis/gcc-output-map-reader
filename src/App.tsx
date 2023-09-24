import { useState, VFC } from "react";
import "./App.css";
import { Box, Container, Typography, IconButton } from "@material-ui/core";
import OutputDrop from "./ui/OutputDrop";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { ObjData } from "./parser/MapParser";
import DataView from "./ui/DataView";

const App: VFC = () => {
  const [data, setData] = useState<ObjData>(new ObjData());

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

        <DataView data={data} />
      </Box>
    </Container>
  );
};

export default App;
