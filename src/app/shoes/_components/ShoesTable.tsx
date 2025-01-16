"use client";

import { RunningShoe } from "@/_types/RunningShoe";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { Table, TableColumnsType } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

interface ShoesTableProps {
  shoes: RunningShoe[];
}

const columns: TableColumnsType<RunningShoe> = [
  {
    title: "Image",
    dataIndex: "image",
    render: (value) => <img src={value} alt="" style={{ height: "100px" }} />,
    width: "15%",
  },
  {
    title: "Name",
    dataIndex: "name",
    showSorterTooltip: { target: "full-header" },
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ["descend"],
  },
  {
    title: "Shoe type",
    dataIndex: "shoeTypeName",
    responsive: ["lg"],
  },
  {
    title: "Category",
    dataIndex: "category",
    render: (value) => <>{value && value.join(", ")}</>,
    responsive: ["lg"],
  },
  {
    title: "US Price",
    dataIndex: "priceUs",
    defaultSortOrder: "descend",
    sorter: (a, b) => (a.priceUs || 0) - (b.priceUs || 0),
    render: (value) => <>{value && `$${value}`}</>,
    responsive: ["lg"],
  },
  {
    title: "EU Price",
    dataIndex: "priceEu",
    sorter: (a, b) => (a.priceEu || 0) - (b.priceEu || 0),
    render: (value) => <>{value && `€${value}`}</>,
    responsive: ["lg"],
  },
  {
    title: "PL Price",
    dataIndex: "pricePl",
    sorter: (a, b) => (a.pricePl || 0) - (b.pricePl || 0),
    render: (value) => <>{value && `${value}zł`}</>,
    responsive: ["lg"],
  },
  {
    title: "US Release",
    dataIndex: "releaseDateUs",
    render: (value) => (
      <>
        {value &&
          Intl.DateTimeFormat("en-GB", {
            month: "short",
            year: "numeric",
          }).format(new Date(value))}
      </>
    ),
    responsive: ["lg"],
  },
  {
    title: "EU Release",
    dataIndex: "releaseDateEu",
    render: (value) => (
      <>
        {value &&
          Intl.DateTimeFormat("en-GB", {
            month: "short",
            year: "numeric",
          }).format(new Date(value))}
      </>
    ),
    responsive: ["lg"],
  },
  {
    title: "PL Release",
    dataIndex: "releaseDatePl",
    render: (value) => (
      <>
        {value &&
          Intl.DateTimeFormat("en-GB", {
            month: "short",
            year: "numeric",
          }).format(new Date(value))}
      </>
    ),
    responsive: ["lg"],
  },
  {
    title: "Reviewed?",
    dataIndex: "reviewed",
    render: (value) =>
      value ? (
        <CheckCircleFilled style={{ fontSize: "30px", color: "green" }} />
      ) : (
        <CloseCircleFilled style={{ fontSize: "30px", color: "gray" }} />
      ),
    responsive: ["lg"],
  },
];

const ShoesTable = ({ shoes }: ShoesTableProps) => {
  const router = useRouter();

  return (
    <Table<RunningShoe>
      columns={columns}
      dataSource={shoes}
      showSorterTooltip={{ target: "sorter-icon" }}
      onRow={(record) => {
        return {
          onClick: () => {
            router.push(`/shoes/${record.slug}`);
          },
        };
      }}
    />
  );
};

export default ShoesTable;
