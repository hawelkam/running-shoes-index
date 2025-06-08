import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Layout } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import SearchInput from "@/_components/SearchInput";
import Sidebar from "@/_components/Sidebar";
import Title from "antd/es/typography/Title";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Running Shoes Index",
  description: "Your complete directory of running shoes",
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
            <Header
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Title style={{ color: "#FFF", margin: 0 }}>
                Running Shoes Index
              </Title>
              <div className="flex items-center">
                <SearchInput />
              </div>
            </Header>
            <Layout>
              <Sidebar />
              <Content>
                <div
                  style={{
                    background: "#f9f9f9",
                    minHeight: 280,
                    padding: 24,
                    borderRadius: "5px",
                  }}
                >
                  {children}
                </div>
              </Content>
            </Layout>

            <Footer style={{ textAlign: "center" }}>
              Michał Hawełka ©{new Date().getFullYear()}
            </Footer>
          </Layout>
        </AntdRegistry>
      </body>
    </html>
  );
}
