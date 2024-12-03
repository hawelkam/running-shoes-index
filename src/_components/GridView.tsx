interface GridViewProps {
  items: any[];
}

export default function GridView({ items }: GridViewProps) {
  return <div className="flex gap-2">{items}</div>;
}
