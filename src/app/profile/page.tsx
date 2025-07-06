import { Suspense } from "react";
import ProfileClient from "./ProfileClient";
import { Spin } from "antd";

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <Spin size="large" />
        </div>
      }
    >
      <ProfileClient />
    </Suspense>
  );
}
