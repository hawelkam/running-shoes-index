"use client";

import { RunningShoe } from "@/_types/RunningShoe";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { List, Table, TableColumnsType } from "antd";
import { useRouter } from "next/navigation";
import React from "react";
import ShoeCard from "./ShoeCard";

interface ShoesTableProps {
  shoes: RunningShoe[];
}

const columns: TableColumnsType<RunningShoe> = [
  {
    title: "Image",
    dataIndex: "image",
    render: (value) => <img src={value} alt="" style={{ height: "100px" }} />,
    width: "20%",
  },
  {
    title: "Name",
    dataIndex: "name",
    showSorterTooltip: { target: "full-header" },
    filters: [
      {
        text: "adidas",
        value: "adidas",
      },
      {
        text: "Hoka",
        value: "Hoka",
      },
    ],
    onFilter: (value, record) => record.name.startsWith(value as string),
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
    filters: [
      {
        text: "Race day",
        value: "Race day",
      },
      {
        text: "Daily trainer",
        value: "Daily trainer",
      },
      {
        text: "Long run",
        value: "Long run",
      },
      {
        text: "Stability trainer",
        value: "Stability trainer",
      },
      {
        text: "Tempo",
        value: "Tempo",
      },
    ],
    onFilter: (value, record) =>
      record.category?.some((cat) => cat === (value as string)) || false,
    render: (value) => <>{value && value.join(", ")}</>,
    responsive: ["lg"],
  },
  {
    title: "US Price",
    dataIndex: "priceUs",
    defaultSortOrder: "descend",
    sorter: (a, b) => (a.priceUs || 0) - (b.priceUs || 0),
    render: (value) => <>{value && `$${value}`}</>,
    responsive: ["xl"],
  },
  {
    title: "EU Price",
    dataIndex: "priceEu",
    sorter: (a, b) => (a.priceEu || 0) - (b.priceEu || 0),
    render: (value) => <>{value && `€${value}`}</>,
    responsive: ["xl"],
  },
  {
    title: "PL Price",
    dataIndex: "pricePl",
    sorter: (a, b) => (a.pricePl || 0) - (b.pricePl || 0),
    render: (value) => <>{value && `${value}zł`}</>,
    responsive: ["xl"],
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
    responsive: ["xl"],
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
    responsive: ["xl"],
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
    responsive: ["xl"],
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
    <>
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
        className="hidden lg:block"
      />
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 3,
          xl: 3,
          xxl: 3,
        }}
        pagination={{ align: "center", position: "bottom" }}
        dataSource={shoes}
        renderItem={(item) => (
          <List.Item>
            <ShoeCard shoe={item} />
          </List.Item>
        )}
        className="lg:hidden"
      />
    </>
  );
};

export default ShoesTable;
