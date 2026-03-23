import { PortalHeader } from "@/components/portal-header";

export default function PortalAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="shell">
      <PortalHeader />
      {children}
    </main>
  );
}
