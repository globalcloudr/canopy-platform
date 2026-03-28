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
    <main className="min-h-screen bg-[var(--background)] md:h-screen md:overflow-hidden">
      <Suspense fallback={null}>
        <PortalHeader />
      </Suspense>
      <div className="md:h-[calc(100vh-3.5rem)]">
        <div className="grid min-h-[calc(100vh-3.5rem)] gap-0 md:h-full md:grid-cols-[280px_minmax(0,1fr)] md:overflow-hidden">
          <aside className="hidden border-r border-[var(--border)] bg-[var(--surface-muted)] p-4 md:block md:h-full">
            <Suspense fallback={null}>
              <PortalSidebar showProvisioning={Boolean(session?.isPlatformOperator)} />
            </Suspense>
          </aside>
          <section className="min-w-0 overflow-x-hidden space-y-5 p-4 sm:p-6 md:h-full md:overflow-y-auto md:p-8">
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
