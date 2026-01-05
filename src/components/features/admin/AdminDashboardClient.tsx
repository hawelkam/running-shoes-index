"use client";

import { useState } from "react";
import { Button, Card, Typography, Space } from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";

import CreateShoeDialog from "@/components/features/admin/CreateShoeDialog";

const { Title, Paragraph } = Typography;

interface User {
  id: number;
  username: string;
  role: string;
}

interface AdminDashboardClientProps {
  user: User;
}

export default function AdminDashboardClient({
  user,
}: AdminDashboardClientProps) {
  const [createShoeDialogOpen, setCreateShoeDialogOpen] = useState(false);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <Title level={1}>Admin Dashboard</Title>
        <Paragraph>
          Welcome, <strong>{user.username}</strong>!
        </Paragraph>
        <Card size="small" className="bg-blue-50 border-blue-200 mb-6">
          <Space>
            <UserOutlined />
            <span>
              <strong>Role:</strong> {user.role}
            </span>
            <span>•</span>
            <span>
              <strong>User ID:</strong> {user.id}
            </span>
          </Space>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card title="Shoe Management" className="shadow-sm">
          <Paragraph>
            Create and manage running shoes in the database.
          </Paragraph>
          <Space direction="vertical" className="w-full">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateShoeDialogOpen(true)}
              block
            >
              Create New Shoe
            </Button>
            <Button
              type="default"
              onClick={() => window.open("/admin/incomplete-shoes", "_blank")}
              block
            >
              View Incomplete Shoes
            </Button>
          </Space>
        </Card>

        <Card title="Review Management" className="shadow-sm">
          <Paragraph>Manage and review shoe reviews and ratings.</Paragraph>
          <Space direction="vertical" className="w-full">
            <Button
              type="default"
              onClick={() => window.open("/admin/review-status", "_blank")}
              block
            >
              Review Status
            </Button>
          </Space>
        </Card>

        <Card title="Quick Links" className="shadow-sm">
          <Paragraph>Quick access to other admin tools.</Paragraph>
          <Space direction="vertical" className="w-full">
            <Button
              type="default"
              onClick={() => window.open("/admin/test", "_blank")}
              block
            >
              Test Page
            </Button>
          </Space>
        </Card>
      </div>

      <CreateShoeDialog
        open={createShoeDialogOpen}
        onClose={() => setCreateShoeDialogOpen(false)}
        onSuccess={() => {
          // Could refresh data or show additional feedback here
        }}
      />
    </div>
  );
}
