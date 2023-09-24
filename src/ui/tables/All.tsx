import { TCell } from "gridjs/dist/src/types";
import Formatter from "../../utils/Formatter";
import Table from "../Table";
import { DataProps } from "../../utils/CommonTypes";

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
    formatter: (cell: TCell): string => Formatter.Size(cell as number),
  },
  "Demangled Name",
  "Moduled Name",
  "File Name",
  "Mandled Name",
];

const TablesAll = ({ data }: DataProps): JSX.Element => {
  return <Table data={data} columns={AllTableColumnsOrder} />;
};

export type { AllTableColumns };
export { AllTableColumnsOrder, TablesAll };
