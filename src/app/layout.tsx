import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Layout, Menu } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Link from "next/link";

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
            <Header style={{ display: "flex", alignItems: "center" }}>
              <div className="demo-logo" />
              <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={["2"]}
                items={[
                  {
                    key: 1,
                    label: <Link href={`/brands`}>Brands</Link>,
                  },
                  {
                    key: 2,
                    label: <Link href={`/shoes`}>Shoes</Link>,
                  },
                  {
                    key: 3,
                    label: (
                      <Link
                        href={`/shoes/released/${Intl.DateTimeFormat("en-GB", {
                          year: "numeric",
                        }).format(new Date())}/${Intl.DateTimeFormat("en-GB", {
                          month: "2-digit",
                        }).format(new Date())}`}
                      >
                        This month&apos;s releases
                      </Link>
                    ),
                  },
                ]}
                style={{ flex: 1, minWidth: 0 }}
              />
            </Header>
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
            <Footer style={{ textAlign: "center" }}>
              Michał Hawełka ©{new Date().getFullYear()}
            </Footer>
          </Layout>
        </AntdRegistry>
      </body>
    </html>
  );
}
