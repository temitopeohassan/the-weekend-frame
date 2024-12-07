import type { Metadata } from "next";

import "~/app/globals.css";

export const metadata: Metadata = {
  title: "The Weekend Quiz",
  description: "Test your knowledge with our weekend quiz!",
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
