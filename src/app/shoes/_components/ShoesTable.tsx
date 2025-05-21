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
    render: (value) => <div>{value && value.map((cat) => <p>{cat}</p>)}</div>,
    responsive: ["lg"],
  },
  {
    title: "Price",
    dataIndex: "price",
    render: (value) => (
      <div>
        {value.pl && <p>{`${value.pl}zł`}</p>}
        {value.eu && <p>{`€${value.eu}`}</p>}
        {value.us && <p>{`$${value.us}`}</p>}
      </div>
    ),
    responsive: ["xl"],
  },
  {
    title: "Release Date",
    dataIndex: "releaseDate",
    render: (value) => (
      <div>
        {value.pl && (
          <p>
            PL:
            {Intl.DateTimeFormat("en-GB", {
              month: "short",
              year: "numeric",
            }).format(new Date(value.pl))}
          </p>
        )}
        {value.eu && (
          <p>
            EU:
            {Intl.DateTimeFormat("en-GB", {
              month: "short",
              year: "numeric",
            }).format(new Date(value.eu))}
          </p>
        )}
        {value.us && (
          <p>
            US:
            {Intl.DateTimeFormat("en-GB", {
              month: "short",
              year: "numeric",
            }).format(new Date(value.us))}
          </p>
        )}
      </div>
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
        pagination={{
          position: ["bottomCenter"],
          total: shoes.length,
          showTotal: (total) => `Total ${total} items`,
        }}
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
        pagination={{
          align: "center",
          position: "bottom",
          total: shoes.length,
          showTotal: (total) => `Total ${total} items`,
        }}
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
