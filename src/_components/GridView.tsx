import { ReactNode } from "react";

interface GridViewProps {
  items: ReactNode[];
}

export default function GridView({ items }: GridViewProps) {
  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
      {items}
    </div>
  );
}
