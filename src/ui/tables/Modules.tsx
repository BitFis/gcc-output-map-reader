import { TCell } from "gridjs/dist/src/types";
import Formatter from "../../utils/Formatter";
import { VFC } from "react";
import Table, { ArrayType } from "../Table";

type ModulesTableColumns = {
  Module: string;
  "Size no .bss": number;
  Size: number;
  "Num of records": number;
};
const ModulesTableColumnsOrder = [
  "Module",
  "Size no .bss",
  {
    name: "Size",
    formatter: (cell: TCell): string => Formatter.Size(cell as number),
  },
  "Num of records",
];

type DataProps = {
  data: ArrayType[][];
};

const ModulesAll: VFC<DataProps> = ({ data }) => {
  return <Table data={data} columns={ModulesTableColumnsOrder} />;
};

export type { ModulesTableColumns };
export { ModulesTableColumnsOrder, ModulesAll };
