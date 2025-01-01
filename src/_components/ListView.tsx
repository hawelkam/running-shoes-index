import { ReactElement } from "react";

interface ListViewProps {
  listViewHeader: ReactElement;
  listViewItems: ReactElement[];
}

export default function ListView({
  listViewHeader,
  listViewItems,
}: ListViewProps) {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          {listViewHeader}
        </thead>
        <tbody>{listViewItems}</tbody>
      </table>
    </div>
  );
}
