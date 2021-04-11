import { Grid } from "gridjs-react";
import { VFC } from "react";
import "./Table.css";

type ArrayType = string | number;

type Props = {
  data: ArrayType[][];
  columns: string[];
};

const Table: VFC<Props> = ({ data, columns }) => {
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
export default Table;
