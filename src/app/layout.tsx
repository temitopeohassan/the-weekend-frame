import type { Metadata } from "next";

import "~/app/globals.css";

export const metadata: Metadata = {
  title: "The Weekend Frame",
  description: "What Stablecoin Are You?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-gray-900">
        {children}
      </body>
    </html>
  );
}
