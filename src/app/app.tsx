"use client";

import dynamic from "next/dynamic";

const Quiz = dynamic(() => import("~/components/Quiz"), {
  ssr: false,
});

export default function App(
  { title }: { title?: string } = { title: "Stablecoin Personality Quiz" }
) {
  return (
    <main className="min-h-screen flex flex-col p-4">
      <Quiz title={title} />
    </main>
  );
}
