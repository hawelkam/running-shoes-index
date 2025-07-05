"use client";

import { useState } from "react";
import { Tabs, Card, Typography, Button, Space } from "antd";
import { UserOutlined, ProductOutlined, StarOutlined } from "@ant-design/icons";
import type { User } from "@/_utils/database";

const { Title, Paragraph } = Typography;

interface AdminClientProps {
  user: User;
}

export default function AdminClient({ user }: AdminClientProps) {
  const [activeTab, setActiveTab] = useState("users");

  const tabItems = [
    {
      key: "users",
      label: (
        <span>
          <UserOutlined />
          Manage Users
        </span>
      ),
      children: (
        <Card>
          <Title level={3}>User Management</Title>
          <Paragraph>
            Manage users, roles, and permissions. This section will allow you
            to:
          </Paragraph>
          <ul>
            <li>View all registered users</li>
            <li>Edit user roles (admin, user, moderator)</li>
            <li>Ban or suspend users</li>
            <li>View user activity and statistics</li>
          </ul>
          <Space style={{ marginTop: 16 }}>
            <Button type="primary" disabled>
              View All Users
            </Button>
            <Button disabled>Add New User</Button>
            <Button disabled>Export User Data</Button>
          </Space>
        </Card>
      ),
    },
    {
      key: "shoes",
      label: (
        <span>
          <ProductOutlined />
          Manage Shoes
        </span>
      ),
      children: (
        <Card>
          <Title level={3}>Shoe Management</Title>
          <Paragraph>
            Manage the shoe database and product information. This section will
            allow you to:
          </Paragraph>
          <ul>
            <li>Add new shoes to the database</li>
            <li>Edit existing shoe specifications</li>
            <li>Manage shoe categories and brands</li>
            <li>Upload and manage shoe images</li>
            <li>Set shoe availability and pricing</li>
            <li>View shoes with incomplete data</li>
          </ul>
          <Space style={{ marginTop: 16 }}>
            <Button type="primary" disabled>
              View All Shoes
            </Button>
            <Button disabled>Add New Shoe</Button>
            <Button disabled>Import Shoe Data</Button>
            <Button disabled>Manage Categories</Button>
            <Button
              type="default"
              onClick={() => window.open("/admin/incomplete-shoes", "_blank")}
            >
              View Incomplete Shoes
            </Button>
          </Space>
        </Card>
      ),
    },
    {
      key: "reviews",
      label: (
        <span>
          <StarOutlined />
          Manage Reviews
        </span>
      ),
      children: (
        <Card>
          <Title level={3}>Review Management</Title>
          <Paragraph>
            Moderate and manage user reviews and ratings. This section will
            allow you to:
          </Paragraph>
          <ul>
            <li>View and moderate all reviews</li>
            <li>Approve or reject pending reviews</li>
            <li>Flag inappropriate content</li>
            <li>Manage review categories and tags</li>
            <li>View review analytics and trends</li>
            <li>Check review status and brand coverage</li>
          </ul>
          <Space style={{ marginTop: 16 }}>
            <Button type="primary" disabled>
              View All Reviews
            </Button>
            <Button disabled>Pending Reviews</Button>
            <Button disabled>Flagged Content</Button>
            <Button disabled>Review Analytics</Button>
            <Button
              type="default"
              onClick={() => window.open("/admin/review-status", "_blank")}
            >
              Review Status
            </Button>
          </Space>
        </Card>
      ),
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <Title level={1}>Admin Panel</Title>
        <Paragraph>
          Welcome, <strong>{user.username}</strong>! You have admin access to
          manage the Stride Lab platform.
        </Paragraph>
        <Card size="small" className="bg-blue-50 border-blue-200">
          <Space>
            <UserOutlined />
            <span>
              <strong>Role:</strong> {user.role}
            </span>
            <span>•</span>
            <span>
              <strong>User ID:</strong> {user.id}
            </span>
            <span>•</span>
            <span>
              <strong>Last Updated:</strong>{" "}
              {user.updated_at
                ? new Date(user.updated_at).toLocaleDateString()
                : "N/A"}
            </span>
          </Space>
        </Card>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
        tabPosition="top"
      />
    </div>
  );
}
