"use client";

import { useState } from "react";
import { Button, Drawer } from "antd";
import { SearchOutlined, MenuOutlined } from "@ant-design/icons";
import Link from "next/link";
import SearchInput from "./SearchInput";

export default function ResponsiveHeader() {
  const [searchVisible, setSearchVisible] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  return (
    <header className="bg-gray-900 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo/Title */}
        <Link
          href="/"
          className="text-white font-bold text-lg hover:text-gray-200"
        >
          <span className="hidden sm:inline">Running Shoes Index</span>
          <span className="sm:hidden">RSI</span>
        </Link>

        {/* Desktop Search and Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="w-80">
            <SearchInput />
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center space-x-2 md:hidden">
          <Button
            type="text"
            icon={<SearchOutlined />}
            onClick={() => setSearchVisible(true)}
            className="text-white hover:text-gray-200 hover:bg-gray-800"
          />
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuVisible(true)}
            className="text-white hover:text-gray-200 hover:bg-gray-800"
          />
        </div>
      </div>

      {/* Mobile Search Drawer */}
      <Drawer
        title="Search Shoes"
        placement="top"
        onClose={() => setSearchVisible(false)}
        open={searchVisible}
        height="auto"
        className="md:hidden"
      >
        <div className="p-4">
          <SearchInput onSearchComplete={() => setSearchVisible(false)} />
        </div>
      </Drawer>

      {/* Mobile Menu Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        className="md:hidden"
      >
        <div className="flex flex-col space-y-4 p-4">
          <Link
            href="/brands"
            className="text-gray-800 hover:text-blue-600 py-2"
            onClick={() => setMobileMenuVisible(false)}
          >
            Brands
          </Link>
          <Link
            href="/shoes"
            className="text-gray-800 hover:text-blue-600 py-2"
            onClick={() => setMobileMenuVisible(false)}
          >
            All Shoes
          </Link>
          <Link
            href={`/shoes/released/${new Date().getFullYear()}/${(new Date().getMonth() + 1).toString().padStart(2, "0")}`}
            className="text-gray-800 hover:text-blue-600 py-2"
            onClick={() => setMobileMenuVisible(false)}
          >
            This Month&apos;s Releases
          </Link>
          <Link
            href="/shoes/reviewed/2025"
            className="text-gray-800 hover:text-blue-600 py-2"
            onClick={() => setMobileMenuVisible(false)}
          >
            2025 Reviews
          </Link>
        </div>
      </Drawer>
    </header>
  );
}
