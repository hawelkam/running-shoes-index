import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Layout } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import ResponsiveHeader from "@/_components/ResponsiveHeader";

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

            <Footer style={{ textAlign: "center" }}>
              Michał Hawełka ©{new Date().getFullYear()}
            </Footer>
          </Layout>
        </AntdRegistry>
      </body>
    </html>
  );
}
