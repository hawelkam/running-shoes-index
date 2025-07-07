import { Suspense } from "react";
import { Spin } from "antd";

import ProfileClient from "./ProfileClient";

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
