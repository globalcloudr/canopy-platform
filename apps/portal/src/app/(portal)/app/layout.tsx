import { Suspense } from "react";
import { PortalHeader } from "@/components/portal-header";

export default function PortalAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="shell">
      <Suspense fallback={null}>
        <PortalHeader />
      </Suspense>
      {children}
    </main>
  );
}
