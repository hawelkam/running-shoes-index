"use client";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import Link from "next/link";
import React, { useState } from "react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        mode="vertical"
        defaultSelectedKeys={["2"]}
        items={[
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
        ]}
        style={{ flex: 1, minWidth: 0 }}
      />
    </Sider>
  );
};

export default Sidebar;
