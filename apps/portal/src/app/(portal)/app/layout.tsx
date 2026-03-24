import { Suspense } from "react";
import { PortalHeader } from "@/components/portal-header";
import { PortalSidebar } from "@/components/portal-sidebar";

export default function PortalAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-bg">
      <Suspense fallback={null}>
        <PortalHeader />
      </Suspense>
      <div className="md:h-[calc(100vh-3.5rem)]">
        <div className="grid min-h-[calc(100vh-3.5rem)] md:h-full md:grid-cols-[260px_minmax(0,1fr)] md:overflow-hidden">
          <aside className="hidden md:block border-r border-[rgba(15,31,61,0.08)] bg-[#f8faff] md:h-full md:overflow-y-auto">
            <Suspense fallback={null}>
              <PortalSidebar />
            </Suspense>
          </aside>
          <section className="min-w-0 p-4 sm:p-6 md:p-8 md:h-full md:overflow-y-auto">
            {children}
          </section>
        </div>
      </div>
    </div>
  );
}
