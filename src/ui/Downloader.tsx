import {
  Alert,
  AlertTitle,
  Backdrop,
  Box,
  Divider,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import DownloadIcon from "@mui/icons-material/UploadFile";
import { MapParser, ObjData } from "../parser/MapParser";
import { useEffect, useState } from "react";
import Timer from "../utils/Timer";
import { useSearchParams } from "react-router-dom";

type Props = {
  OnLoaded: (data: ObjData) => void;
};

enum ProcessState {
  Idle,
  Start,
  Download,
  Prepare,
  Parse,
  LoadView,
  Done,
  Failed,
}

type ProgressType = {
  State: ProcessState;
  Progress: number;
};

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number; label: string }
) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress size={"6rem"} variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {props.label}
        </Typography>
      </Box>
    </Box>
  );
}

const fileQuery = "file";

const Downloader = ({ OnLoaded }: Props): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [downloadUrl, setDownloadUrl] = useState<string>(() => {
    const file = searchParams.get(fileQuery);
    return file ? file : "";
  });
  const [state, setState] = useState<ProgressType>(Progress(ProcessState.Idle));
  const [error, setError] = useState<string | null>(null);

  function IsBusy(): boolean {
    return !(
      state.State == ProcessState.Idle || state.State == ProcessState.Done
    );
  }

  function GetState(): string {
    return ProcessState[state.State];
  }

  function GetProgress(): number {
    return state.Progress;
  }

  function Progress(state: ProcessState) {
    return {
      Progress: ProgressState(state),
      State: state,
    };
  }

  function SetProgress(state: ProcessState) {
    setState(Progress(state));
  }

  function ProgressState(state: ProcessState) {
    let prog = 0;
    switch (state) {
      case ProcessState.Idle:
      case ProcessState.Failed:
      case ProcessState.Start:
        prog = 0;
        break;
      case ProcessState.Download:
        prog = 1;
        break;
      case ProcessState.Prepare:
        prog = 2;
        break;
      case ProcessState.Parse:
        prog = 3;
        break;
      case ProcessState.LoadView:
        prog = 4;
        break;
      case ProcessState.Done:
        prog = 5;
        break;
    }
    return (100 / 5) * prog;
  }

  function downloadFile(source: string) {
    const t = new Timer();

    setSearchParams(searchParams);
    console.debug(`Start Download: '${source}'`);
    setState({ State: ProcessState.Start, Progress: 0 });

    // TODO: requires cleanup, should be clean piped in steps without indent
    fetch(source)
      .then((res) => {
        return new Promise<Blob>((resolve, reject) => {
          SetProgress(ProcessState.Download);
          if (res.ok) {
            console.debug("Download success");
            resolve(res.blob());
          } else {
            console.error(`Request '${source}' faield`, res);
            reject(res);
          }
        });
      })
      .then(async (blob) => {
        SetProgress(ProcessState.Prepare);
        console.debug(`Start process ${blob.size} bytes (${t.Format()})`);
        return blob.text();
      })
      .then(async (data) => {
        SetProgress(ProcessState.Parse);
        const parser = new MapParser();
        await parser.parse(data);
        console.debug(`Data processed (${t.Format()})`);
        return parser;
      })
      .then((parsed) => {
        SetProgress(ProcessState.LoadView);
        OnLoaded(parsed);
      })
      .then(() => {
        SetProgress(ProcessState.Done);
      })
      .catch((err) => {
        console.error(`Download failed ${err}`);
        setError("");
      })
      .finally(() => {
        console.debug(`Download of ${source} done (${t.Format()})`);
        SetProgress(ProcessState.Done);
      });
  }

  useEffect(() => {
    const file = searchParams.get(fileQuery);
    if (file) {
      downloadFile(file);
    }
  }, [searchParams]);

  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={IsBusy()}
      >
        <CircularProgressWithLabel value={GetProgress()} label={GetState()} />
      </Backdrop>
      {error != null ? (
        <Alert onClose={() => setError(null)} severity="error">
          <AlertTitle>Download Failed!</AlertTitle>
          {error}
        </Alert>
      ) : (
        ""
      )}
      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",

          alignItems: "center",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          searchParams.set(fileQuery, downloadUrl);
          downloadFile(downloadUrl);
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Download by url"
          inputProps={{ "aria-label": "search google maps" }}
          value={downloadUrl}
          fullWidth={true}
          onChange={(e) => setDownloadUrl(e.target.value)}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton
          onClick={() => {
            searchParams.set(fileQuery, downloadUrl);
            downloadFile(downloadUrl);
          }}
          color="primary"
          sx={{ p: "10px" }}
          aria-label="directions"
        >
          <DownloadIcon />
        </IconButton>
      </Paper>
    </div>
  );
};
export default Downloader;
