import { Suspense } from "react";
import { resolvePortalSession } from "@/lib/platform";
import { PortalHeader } from "@/components/portal-header";
import { PortalSidebar } from "@/components/portal-sidebar";

export default async function PortalAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await resolvePortalSession();

  return (
    <div className="min-h-screen bg-bg md:flex md:h-screen md:flex-col">
      <Suspense fallback={null}>
        <PortalHeader />
      </Suspense>
      <div className="md:min-h-0 md:flex-1">
        <div className="grid min-h-[calc(100vh-7.5rem)] md:h-full md:grid-cols-[280px_minmax(0,1fr)] md:overflow-hidden">
          <aside className="hidden border-r border-[var(--shell-rail-border)] bg-[var(--shell-rail)] md:block md:h-full md:overflow-y-auto">
            <Suspense fallback={null}>
              <PortalSidebar showProvisioning={Boolean(session?.isPlatformOperator)} />
            </Suspense>
          </aside>
          <section className="min-w-0 bg-[var(--shell-content)] p-4 sm:p-6 md:h-full md:overflow-y-auto md:p-8">
            {children}
          </section>
        </div>
      </div>
    </div>
  );
}
