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
    <main className="min-h-screen bg-[var(--app-shell-bg)] md:h-screen md:overflow-hidden md:overscroll-none">
      <Suspense fallback={null}>
        <PortalHeader />
      </Suspense>
      <div className="md:h-[calc(100vh-3.5rem)]">
        <div className="grid min-h-[calc(100vh-3.5rem)] gap-0 md:h-full md:grid-cols-[280px_minmax(0,1fr)] md:grid-rows-[minmax(0,1fr)] md:overflow-hidden">
          <aside className="hidden border-r border-[var(--app-divider)] bg-transparent md:block md:h-full">
            <Suspense fallback={null}>
              <PortalSidebar showProvisioning={Boolean(session?.isPlatformOperator)} />
            </Suspense>
          </aside>
          <section className="min-w-0 overflow-x-hidden bg-[var(--app-content-bg)] md:h-full md:overflow-y-auto md:overscroll-y-contain">
            <div className="mx-auto flex min-h-full w-full max-w-[1340px] flex-col gap-5 px-4 py-6 sm:px-6">
              {children}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
