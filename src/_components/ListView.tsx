import { ReactElement } from "react";
import PaginationControls from "./PaginationControls";

interface ListViewProps {
  listViewItems: ReactElement[];
}

export default function ListView({ listViewItems }: ListViewProps) {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex flex-col gap-4">{listViewItems}</div>
      <PaginationControls />
    </div>
  );
}
