import { Skeleton } from "@mui/material";

const TableSkeleton = (): JSX.Element => {
  return (
    <div>
      <Skeleton animation={false} height={64} />
      <Skeleton variant="rectangular" animation={false} height={500} />
    </div>
  );
};
export { TableSkeleton };
