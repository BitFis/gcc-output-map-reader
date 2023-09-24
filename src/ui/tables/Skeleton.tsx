import { Skeleton } from "@material-ui/core";
import { VFC } from "react";

const TableSkeleton: VFC = () => {
  return (
    <div>
      <Skeleton animation={false} height={64} />
      <Skeleton variant="rectangular" animation={false} height={500} />
    </div>
  );
};
export { TableSkeleton };
