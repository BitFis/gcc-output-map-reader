import { Grid } from "gridjs-react";
import { VFC } from "react";
import "./Table.css";

const Table: VFC = () => {
  return (
    <div>
      <Grid
        data={[
          ["", 105000, 105000, 2311],
          [" Source/libCTestLib.a", 1993516, 1994816, 10279],
        ]}
        columns={["Module", "Size no .bss", "Size", "Num of records"]}
        search={true}
        pagination={{
          enabled: true,
          limit: 100,
        }}
        className={{
          td: "dense-table-cell light-content",
          th: "dense-table-cell",
          footer: "dense-table-cell",
        }}
      />
    </div>
  );
};
export default Table;
