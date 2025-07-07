import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Layout } from "antd";
import { Content, Footer } from "antd/es/layout/layout";

import ResponsiveHeader from "@/components/layout/ResponsiveHeader";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Stride Lab",
  description: "Your complete directory of running shoes",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AntdRegistry>
          <Layout>
            <ResponsiveHeader />
            <Content>
              <div
                style={{
                  background: "#f9f9f9",
                  minHeight: 280,
                }}
              >
                {children}
              </div>
            </Content>

            <Footer className="flex justify-between items-center border-t border-gray-300 px-6 py-8 text-sm">
              <div className="font-extrabold text-lg">SL_</div>
              <div className="space-x-6">
                <a href="#" className="hover:underline">
                  Instagram
                </a>
                <a href="#" className="hover:underline">
                  Kontakt
                </a>
                <a href="#" className="hover:underline">
                  Regulamin
                </a>
              </div>
            </Footer>
          </Layout>
        </AntdRegistry>
      </body>
    </html>
  );
}
