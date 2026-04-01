import type { ReactNode } from "react";
import { AppSurface, BodyText, Eyebrow, PageTitle } from "@canopy/ui";

type PortalPageHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  meta?: ReactNode;
  actions?: ReactNode;
};

export function PortalPageHeader({ eyebrow, title, subtitle, meta, actions }: PortalPageHeaderProps) {
  return (
    <AppSurface variant="clear" className="overflow-hidden rounded-[34px] px-6 py-7 sm:px-8 sm:py-8">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="min-w-0">
          <Eyebrow className="text-[#2f76dd]">{eyebrow}</Eyebrow>
          <PageTitle className="mt-3 text-[#172033]">{title}</PageTitle>
          <BodyText muted className="mt-3 max-w-3xl text-[#617286] sm:text-[15px]">
            {subtitle}
          </BodyText>
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
      {meta ? <div className="mt-5 flex flex-wrap items-center gap-2">{meta}</div> : null}
    </AppSurface>
  );
}
