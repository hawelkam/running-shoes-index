"use client";
import { Menu } from "antd";
import Link from "next/link";
import React from "react";

const menuItems = [
  {
    key: 1,
    label: <Link href={`/brands`}>Brands</Link>,
  },
  {
    key: 2,
    label: <Link href={`/shoes`}>All shoes</Link>,
  },
  {
    key: 3,
    label: (
      <Link
        href={`/shoes/released/${Intl.DateTimeFormat("en-GB", {
          year: "numeric",
        }).format(new Date())}/${Intl.DateTimeFormat("en-GB", {
          month: "2-digit",
        }).format(new Date())}`}
      >
        This month&apos;s releases
      </Link>
    ),
  },
  {
    key: 4,
    label: <Link href={`/shoes/reviewed/2025`}>2025 reviews</Link>,
  },
];

const Sidebar = () => {
  return (
    <nav className="w-full bg-gray-900 px-4 py-2">
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["2"]}
        items={menuItems}
        style={{ border: "none", background: "transparent" }}
      />
    </nav>
  );
};

export default Sidebar;
