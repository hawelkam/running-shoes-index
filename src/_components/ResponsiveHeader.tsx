"use client";

import { useState, useEffect } from "react";
import { Button, Drawer, Dropdown, Avatar, message } from "antd";
import {
  SearchOutlined,
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import SearchInput from "./SearchInput";
import { getStravaAuthUrl } from "@/_utils/auth/getStravaAuthUrl";
import {
  getStravaUserInfo,
  clearStravaAuth,
  type StravaUserInfo,
} from "@/_utils/auth/stravaAuth";

export default function ResponsiveHeader() {
  const [searchVisible, setSearchVisible] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [stravaUser, setStravaUser] = useState<StravaUserInfo | null>(null);
  const [authUrl, setAuthUrl] = useState<string>("#");

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  useEffect(() => {
    // Check for authentication on component mount
    const user = getStravaUserInfo();
    setStravaUser(user);

    // Get the auth URL on the client side
    const url = getStravaAuthUrl();
    setAuthUrl(url);

    // Check for auth success/error in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get("auth");
    const errorStatus = urlParams.get("error");

    if (authStatus === "success") {
      message.success("Successfully signed in with Strava!");
      // Remove the query param from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Recheck user info after successful auth
      const updatedUser = getStravaUserInfo();
      setStravaUser(updatedUser);
    } else if (errorStatus) {
      let errorMessage = "Authentication failed. Please try again.";
      switch (errorStatus) {
        case "strava_auth_denied":
          errorMessage = "Strava authentication was denied.";
          break;
        case "no_auth_code":
          errorMessage = "No authorization code received from Strava.";
          break;
        case "invalid_token":
          errorMessage = "Invalid token received from Strava.";
          break;
        case "auth_failed":
          errorMessage = "Authentication failed. Please try again.";
          break;
      }
      message.error(errorMessage);
      // Remove the query param from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleLogout = () => {
    clearStravaAuth();
    setStravaUser(null);
    message.success("Successfully signed out!");
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: `${stravaUser?.firstName} ${stravaUser?.lastName}`,
      disabled: true,
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Sign out",
      onClick: handleLogout,
    },
  ];

  return (
    <header className="flex justify-between items-center border-b border-gray-300 px-6 py-4 text-black">
      <div className="flex items-center justify-between w-full">
        {/* Logo/Title */}
        <Link
          href="/"
          className="text-white font-bold text-lg hover:text-gray-200 flex items-center"
        >
          <div className="text-2xl font-extrabold leading-tight text-black">
            STRIDE
            <br />
            <span className="tracking-wide">LAB_</span>
          </div>
        </Link>
        {/* Desktop Navigation and Search */}
        <div className="hidden lg:flex items-center space-x-6">
          {/* Quick Navigation Links */}
          <nav className="flex items-center space-x-6">
            <Link
              href="/brands"
              className="text-black hover:text-black hover:underline transition-colors px-3 py-2"
            >
              Brands
            </Link>
            <Link
              href="/reviews"
              className="text-black hover:text-black hover:underline transition-colors px-3 py-2"
            >
              Reviews
            </Link>
            <Link
              href="/stats"
              className="text-black hover:text-black hover:underline transition-colors px-3 py-2"
            >
              Statistics
            </Link>
            <Link
              href={`/shoes/released/${currentYear}/${currentMonth.toString().padStart(2, "0")}`}
              className="text-black hover:text-black hover:underline transition-colors px-3 py-2"
            >
              This Month
            </Link>
            <Link
              href={`/shoes/released/${currentYear}`}
              className="text-black hover:text-black hover:underline transition-colors px-3 py-2"
            >
              This Year
            </Link>
          </nav>

          {/* Search */}
          <div className="w-80">
            <SearchInput />
          </div>

          {/* Authentication */}
          <div className="flex items-center">
            {!stravaUser ? (
              <Link href={authUrl}>
                <Button type="primary" disabled={authUrl === "#"}>
                  Sign in with Strava
                </Button>
              </Link>
            ) : (
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Button
                  type="text"
                  className="flex items-center space-x-2 text-white hover:bg-gray-800"
                >
                  <Avatar size="small" icon={<UserOutlined />} />
                  <span>{stravaUser.firstName}</span>
                </Button>
              </Dropdown>
            )}
          </div>
        </div>

        {/* Tablet Search (between lg and md) */}
        <div className="hidden md:flex lg:hidden items-center space-x-6">
          <div className="w-80">
            <SearchInput />
          </div>
          {/* Authentication for tablet */}
          {!stravaUser ? (
            <Link href={authUrl}>
              <Button type="primary" size="small" disabled={authUrl === "#"}>
                Sign in
              </Button>
            </Link>
          ) : (
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Button
                type="text"
                size="small"
                className="text-white hover:bg-gray-800"
              >
                <Avatar size="small" icon={<UserOutlined />} />
              </Button>
            </Dropdown>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center space-x-2 md:hidden">
          <Button
            type="text"
            icon={<SearchOutlined className="text-black" />}
            onClick={() => setSearchVisible(true)}
            className="hover:bg-gray-800 border-none text-black"
          />
          <Button
            type="text"
            icon={<MenuOutlined className="text-black" />}
            onClick={() => setMobileMenuVisible(true)}
            className="hover:bg-gray-800 border-none text-black"
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
        title="Navigation Menu"
        placement="right"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        className="md:hidden"
        width={300}
      >
        <div className="flex flex-col space-y-1 p-2">
          {/* Quick Navigation Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Quick Navigation
            </h3>

            <Link
              href="/brands"
              className="flex items-center p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors mb-2"
              onClick={() => setMobileMenuVisible(false)}
            >
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-800">Browse Brands</div>
                <div className="text-xs text-gray-600">
                  Explore all shoe brands
                </div>
              </div>
            </Link>

            <Link
              href="/reviews"
              className="flex items-center p-3 rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors mb-2"
              onClick={() => setMobileMenuVisible(false)}
            >
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-800">2025 Reviews</div>
                <div className="text-xs text-gray-600">
                  Recently reviewed shoes
                </div>
              </div>
            </Link>

            <Link
              href="/stats"
              className="flex items-center p-3 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors mb-2"
              onClick={() => setMobileMenuVisible(false)}
            >
              <div className="bg-indigo-100 p-2 rounded-full mr-3">
                <svg
                  className="w-4 h-4 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-800">Statistics</div>
                <div className="text-xs text-gray-600">
                  Data analysis & trends
                </div>
              </div>
            </Link>

            <Link
              href={`/shoes/released/${currentYear}/${currentMonth.toString().padStart(2, "0")}`}
              className="flex items-center p-3 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors mb-2"
              onClick={() => setMobileMenuVisible(false)}
            >
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <svg
                  className="w-4 h-4 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-800">This Month</div>
                <div className="text-xs text-gray-600">June 2025 releases</div>
              </div>
            </Link>

            <Link
              href={`/shoes/released/${currentYear}`}
              className="flex items-center p-3 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors mb-2"
              onClick={() => setMobileMenuVisible(false)}
            >
              <div className="bg-orange-100 p-2 rounded-full mr-3">
                <svg
                  className="w-4 h-4 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-800">This Year</div>
                <div className="text-xs text-gray-600">2025 releases</div>
              </div>
            </Link>
          </div>

          {/* Additional Links */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Browse
            </h3>
            <Link
              href="/shoes"
              className="flex items-center p-3 rounded-lg hover:bg-gray-50 text-gray-800 hover:text-gray-900 transition-colors"
              onClick={() => setMobileMenuVisible(false)}
            >
              All Shoes
            </Link>
          </div>

          {/* Authentication Section */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            {!stravaUser ? (
              <Link href={authUrl}>
                <Button
                  type="primary"
                  block
                  disabled={authUrl === "#"}
                  onClick={() => setMobileMenuVisible(false)}
                >
                  Sign in with Strava
                </Button>
              </Link>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Avatar icon={<UserOutlined />} className="mr-3" />
                  <div>
                    <div className="font-medium">
                      {stravaUser.firstName} {stravaUser.lastName}
                    </div>
                    <div className="text-xs text-gray-600">
                      Signed in with Strava
                    </div>
                  </div>
                </div>
                <Button
                  icon={<LogoutOutlined />}
                  block
                  onClick={() => {
                    handleLogout();
                    setMobileMenuVisible(false);
                  }}
                >
                  Sign out
                </Button>
              </div>
            )}
          </div>
        </div>
      </Drawer>
    </header>
  );
}
