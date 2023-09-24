import { Grid } from "gridjs-react";
import { OneDArray, TColumn } from "gridjs/dist/src/types";
import "./Table.css";
import { ArrayType } from "../utils/CommonTypes";

type ComponentChild = string | number | bigint | boolean | null | undefined;

type TableContentType = string | number;

type Props = {
  data: ArrayType[][];
  columns: OneDArray<TColumn | string | ComponentChild>;
};

const Table = ({ data, columns }: Props): JSX.Element => {
  return (
    <div>
      <Grid
        data={data}
        columns={columns}
        search={true}
        sort={true}
        pagination={{
          enabled: true,
          limit: 200,
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
export type { TableContentType, ArrayType };
export default Table;
