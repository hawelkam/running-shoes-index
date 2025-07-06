"use client";

import React, { useEffect, useState } from "react";
import { Avatar, Card, Button, Descriptions, Spin, Alert, Badge } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { clearStravaAuth } from "@/_utils/auth/stravaAuth";
import { useRouter } from "next/navigation";

interface UserInfo {
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

const ProfileClient: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/user/info");

        if (!response.ok) {
          if (response.status === 401) {
            // User is not authenticated, redirect to login
            router.push("/");
            return;
          }
          throw new Error("Failed to fetch user info");
        }

        const data = await response.json();
        setUserInfo(data.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      clearStravaAuth();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, clear local auth and redirect
      clearStravaAuth();
      router.push("/");
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { color: "red", text: "Admin" },
      editor: { color: "blue", text: "Editor" },
      user: { color: "green", text: "User" },
    };

    const config = roleConfig[role as keyof typeof roleConfig] || {
      color: "default",
      text: role,
    };
    return <Badge color={config.color} text={config.text} />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert
          message="Error Loading Profile"
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert
          message="No User Data"
          description="Unable to load your profile information."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="text-center">
            <Avatar
              size={120}
              src={userInfo.stravaInfo.profilePicture}
              icon={<UserOutlined />}
              className="mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">
              {userInfo.stravaInfo.firstName} {userInfo.stravaInfo.lastName}
            </h2>
            <p className="text-gray-600 mb-4">@{userInfo.username}</p>
            <div className="mb-4">{getRoleBadge(userInfo.role)}</div>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              block
            >
              Sign Out
            </Button>
          </Card>
        </div>

        {/* Account Details */}
        <div className="lg:col-span-2">
          <Card title="Account Information" className="mb-6">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Full Name">
                {userInfo.stravaInfo.firstName} {userInfo.stravaInfo.lastName}
              </Descriptions.Item>
              <Descriptions.Item label="Username">
                {userInfo.username}
              </Descriptions.Item>
              <Descriptions.Item label="Role">
                {getRoleBadge(userInfo.role)}
              </Descriptions.Item>
              <Descriptions.Item label="User ID">
                #{userInfo.id}
              </Descriptions.Item>
              <Descriptions.Item label="Member Since">
                {formatDate(userInfo.created_at)}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {formatDate(userInfo.updated_at)}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Strava Integration */}
          <Card title="Strava Integration" className="mb-6">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Strava ID">
                {userInfo.stravaInfo.id}
              </Descriptions.Item>
              <Descriptions.Item label="Connection Status">
                <Badge status="success" text="Connected" />
              </Descriptions.Item>
              <Descriptions.Item label="Profile Picture">
                {userInfo.stravaInfo.profilePicture ? (
                  <span className="text-green-600">Available</span>
                ) : (
                  <span className="text-gray-500">Not set</span>
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="space-y-3">
              <Button
                icon={<SettingOutlined />}
                type="default"
                block
                onClick={() => router.push("/shoes")}
              >
                Browse Running Shoes
              </Button>
              {userInfo.role === "admin" && (
                <Button
                  type="default"
                  block
                  onClick={() => router.push("/admin")}
                >
                  Admin Dashboard
                </Button>
              )}
              <Button
                type="default"
                block
                onClick={() => router.push("/reviews")}
              >
                View Reviews
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileClient;
