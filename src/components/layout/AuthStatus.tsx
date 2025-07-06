"use client";

import { useEffect, useState } from "react";
import { Avatar, Button, Dropdown, Space } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import {
  getStravaUserInfo,
  clearStravaAuth,
  type StravaUserInfo,
} from "@/utils/auth/stravaAuth";
import { getStravaAuthUrl } from "@/utils/auth/getStravaAuthUrl";

interface AuthStatusProps {
  size?: "small" | "large";
  showAvatar?: boolean;
}

interface DatabaseUser {
  id: number;
  username: string;
  role: string;
  created_at: string;
  updated_at: string;
  stravaInfo: {
    id: number;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
}

export default function AuthStatus({
  size,
  showAvatar = true,
}: AuthStatusProps) {
  const [stravaUser, setStravaUser] = useState<StravaUserInfo | null>(null);
  const [dbUser, setDbUser] = useState<DatabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authUrl, setAuthUrl] = useState<string>("#");

  useEffect(() => {
    // Check for authentication on component mount
    const user = getStravaUserInfo();
    setStravaUser(user);

    // Get the auth URL on the client side
    const url = getStravaAuthUrl();
    setAuthUrl(url);

    // Fetch database user info if authenticated
    if (user) {
      fetchDatabaseUser();
    }

    setLoading(false);
  }, []);

  const fetchDatabaseUser = async () => {
    try {
      const response = await fetch("/api/user/info");
      if (response.ok) {
        const data = await response.json();
        setDbUser(data.user);
      }
    } catch (error) {
      console.error("Error fetching database user info:", error);
    }
  };

  const handleLogout = async () => {
    try {
      // Call server-side logout endpoint
      await fetch("/api/auth/logout", { method: "POST" });

      // Clear client-side cookies as well
      clearStravaAuth();
      setStravaUser(null);
      setDbUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback to client-side only logout
      clearStravaAuth();
      setStravaUser(null);
      setDbUser(null);
    }
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: `${stravaUser?.firstName} ${stravaUser?.lastName}`,
      disabled: true,
    },
    ...(dbUser?.role === "admin"
      ? [
          {
            type: "divider" as const,
          },
          {
            key: "admin",
            icon: <SettingOutlined />,
            label: <Link href="/admin">Admin Panel</Link>,
          },
        ]
      : []),
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!stravaUser) {
    return (
      <Link href={authUrl}>
        <Button type="primary" size={size} disabled={authUrl === "#"}>
          Sign in with Strava
        </Button>
      </Link>
    );
  }

  return (
    <Dropdown
      menu={{ items: userMenuItems }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <Button type="text" size={size}>
        <Space>
          {showAvatar && (
            <Avatar
              size={size === "small" ? 24 : size === "large" ? 40 : 32}
              src={stravaUser.profilePicture}
              icon={<UserOutlined />}
            />
          )}
          <span>{stravaUser.firstName}</span>
        </Space>
      </Button>
    </Dropdown>
  );
}
