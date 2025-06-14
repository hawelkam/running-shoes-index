"use client";

import { RunningShoe } from "@/_types/RunningShoe";
import {
  CheckCircleFilled,
  ClockCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons";
import { List, Table, TableColumnsType, Input, Image } from "antd";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import ShoeCard from "./ShoeCard";

interface ShoesTableProps {
  shoes: RunningShoe[];
}

const columns: TableColumnsType<RunningShoe> = [
  {
    title: "Image",
    dataIndex: "image",
    render: (value) =>
      value ? (
        <Image
          src={value}
          alt=""
          height={100}
          width={200}
          style={{ objectFit: "contain" }}
        />
      ) : null,
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
    render: (value: string[]) => (
      <div>{value && value.map((cat) => <p key={cat}>{cat}</p>)}</div>
    ),
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
    render: (value) => {
      if (value === "Yes") {
        return (
          <CheckCircleFilled style={{ fontSize: "30px", color: "green" }} />
        );
      } else if (value === "No") {
        return (
          <CloseCircleFilled style={{ fontSize: "30px", color: "gray" }} />
        );
      } else {
        return (
          <ClockCircleFilled style={{ fontSize: "30px", color: "orange" }} />
        );
      }
    },
    responsive: ["lg"],
  },
];

const ShoesTable = ({ shoes }: ShoesTableProps) => {
  const router = useRouter();
  const [filter, setFilter] = useState("");

  // Filter shoes by phrase (case-insensitive, checks name, shoeTypeName, and categories)
  const filteredShoes = useMemo(() => {
    if (!filter.trim()) return shoes;
    const phrase = filter.toLowerCase();
    return shoes.filter((shoe) =>
      [shoe.name, shoe.shoeTypeName, ...(shoe.category || [])]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(phrase))
    );
  }, [filter, shoes]);

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Input
          placeholder="Filter shoes..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ maxWidth: 300 }}
          allowClear
        />
      </div>
      <Table<RunningShoe>
        columns={columns}
        dataSource={filteredShoes}
        showSorterTooltip={{ target: "sorter-icon" }}
        onRow={(record) => {
          return {
            onClick: () => {
              router.push(`/shoes/${record.slug}`);
            },
          };
        }}
        className="hidden lg:block"
        scroll={{ x: true }}
        size="middle"
        pagination={{
          position: ["bottomCenter"],
          total: filteredShoes.length,
          showTotal: (total) => `Total ${total} items`,
          showSizeChanger: true,
          showQuickJumper: true,
          defaultPageSize: 20,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        style={{ width: "100%" }}
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
          total: filteredShoes.length,
          showTotal: (total) => `Total ${total} items`,
        }}
        dataSource={filteredShoes}
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
