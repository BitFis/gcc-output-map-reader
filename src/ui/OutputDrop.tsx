import { Alert, AlertTitle, Box, Button } from "@material-ui/core";
import { useState, VFC } from "react";
import { FileDrop } from "react-file-drop";
import { useFilePicker } from "use-file-picker";
import MapParser from "../parser/MapParser";
import Timer from "../utils/Timer";

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

type Props = {
  OnLoaded: (mapParser: MapParser) => void;
};

const OutputDrop: VFC<Props> = ({ OnLoaded }) => {
  const [filesContent, errors, openFileSelector, loading] = useFilePicker({
    multiple: false,
    // accept: '.ics,.pdf',
    accept: [".map"],
  });
  // TMP
  openFileSelector;
  const [dropLoading, setDropLoading] = useState(false);
  const [dropError, setDropError] = useState<boolean | string>(false);
  const [filesystemError, setFilesystemError] = useState<boolean | string>(
    false
  );
  const [hover, setHover] = useState(false);

  if (filesContent[0]) {
    console.log(
      "loading through filesystem currently not supported!",
      JSON.stringify(filesContent)
    );
  }

  return (
    <div>
      {errors.length > 0 ? (
        <Alert onClose={() => (errors.length = 0)} severity="error">
          <AlertTitle>Error occured while opening file!</AlertTitle>
          {JSON.stringify(errors)}
        </Alert>
      ) : (
        ""
      )}
      {filesystemError ? (
        <Alert onClose={() => setFilesystemError(false)} severity="warning">
          <AlertTitle>{filesystemError}</AlertTitle>
          Drop the file onto the region.
        </Alert>
      ) : (
        ""
      )}
      {dropError ? (
        <Alert onClose={() => setDropError(false)} severity="error">
          <AlertTitle>Loading Dropped file failed!</AlertTitle>
          {dropError}
        </Alert>
      ) : (
        ""
      )}
      <FileDrop
        onDrop={(files) => {
          const timer = new Timer();
          timer.Reset();
          console.debug(`Start loading file`);
          setDropLoading(true);
          // lets run in background
          parseFile(files)
            .then(OnLoaded)
            .catch((err) => setDropError(err))
            .finally(() => {
              setDropLoading(false);
              console.debug(
                `Loading and parsing file done [${timer.Format()}]`
              );
            });
        }}
        onDragOver={() => {
          if (!hover) {
            setHover(true);
          }
        }}
        onDragLeave={() => {
          if (hover) {
            setHover(false);
          }
        }}
      >
        <Box
          sx={{ p: 0, border: "1px dashed grey", m: "auto" }}
          justifyContent="center"
          justifyItems="center"
        >
          <Button
            disabled={loading || dropLoading}
            onClick={() => {
              // openFileSelector()
              setFilesystemError("openFileSelector currently not supported");
            }}
            sx={{ p: 3, m: "auto" }}
            fullWidth={true}
            style={
              hover
                ? {
                    backgroundColor: "rgba(63, 81, 181, 0.04)",
                  }
                : {}
            }
          >
            {loading || dropLoading
              ? "Loading ... (Will currently block any interaction)"
              : "Drop output.map here"}
          </Button>
        </Box>
      </FileDrop>
    </div>
  );
};

export default OutputDrop;
