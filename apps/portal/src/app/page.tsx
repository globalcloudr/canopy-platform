import Link from "next/link";
import {
  Image as ImageIcon,
  Sparkles,
  Send,
  Newspaper,
  Palette,
  Globe,
  BarChart3,
  ChevronRight,
  BotMessageSquare,
} from "lucide-react";

// TODO: Replace with your Calendly link before deploying
const DEMO_URL = "https://calendly.com/globalclouder/30min";

// Coral glow / orange palette
const B = {
  50:  "#ffede5",
  100: "#ffdbcc",
  200: "#ffb899",
  300: "#ff9466",
  400: "#ff7033",
  500: "#ff4d00",
  600: "#cc3d00",
  700: "#992e00",
  800: "#661f00",
  900: "#330f00",
  950: "#240b00",
};

const liveProducts = [
  {
    key: "photovault",
    Icon: ImageIcon,
    eyebrow: "Photo & Asset Management",
    accentColor: B[800],
    accentBg: B[50],
    headline: "Your approved photos and brand assets — always organized.",
    body: "Upload your marketing-approved photos, logos, and brand files once. Your whole team knows exactly what's cleared for use — no version confusion, no wrong photos in the wrong place.",
  },
  {
    key: "stories",
    Icon: Sparkles,
    eyebrow: "AI Content Production",
    accentColor: B[700],
    accentBg: B[100],
    headline: "Turn student successes into polished content — automatically.",
    body: "Your staff sends a short intake form. The student fills it out. Canopy transforms their answers into a blog post, newsletter feature, social posts, and a short video — ready for your review before anything goes public.",
  },
  {
    key: "reach",
    Icon: Send,
    eyebrow: "Social Media Publishing",
    accentColor: B[600],
    accentBg: B[50],
    headline: "Write, schedule, and publish to every channel — from one place.",
    body: "Connect your school's social accounts and manage your entire publishing calendar from one dashboard. Draft a post, pick a time, and Canopy handles the rest.",
  },
];

const comingSoon = [
  { Icon: Newspaper,      label: "Canopy Community", desc: "Newsletters and recurring communications" },
  { Icon: Palette,        label: "Canopy Create",    desc: "Design requests and collateral production" },
  { Icon: Globe,          label: "Canopy Publish",   desc: "Digital brochures and publications" },
  { Icon: BotMessageSquare, label: "Canopy Assistant", desc: "AI knowledge and communications layer" },
  { Icon: BarChart3,      label: "Canopy Insights",  desc: "Cross-product analytics and reporting" },
];

const differentiators = [
  {
    n: "01",
    title: "Your brand, always under control",
    body: "Approved photos, logos, and brand assets in one place — so your team always knows what's cleared for marketing. No version confusion, no wrong-photo moments.",
  },
  {
    n: "02",
    title: "Built for schools like yours",
    body: "Not K-12. Not a generic marketing tool. Canopy is designed around how adult education teams actually work — ESL programs, workforce training, adult diploma tracks.",
  },
  {
    n: "03",
    title: "Less work, better results",
    body: "Canopy handles the repetitive work automatically — turning a student interview into a blog post, newsletter feature, and social content in minutes, not hours.",
  },
];

/** Browser-chrome mockup placeholder — replace each instance with <Image> once screenshots are ready */
function ProductMockup() {
  return (
    <div className="cp-mockup" aria-hidden="true">
      <div className="cp-mockup-chrome">
        <span className="cp-mockup-dot" style={{ background: "#f87171" }} />
        <span className="cp-mockup-dot" style={{ background: "#fbbf24" }} />
        <span className="cp-mockup-dot" style={{ background: "#4ade80" }} />
        <div className="cp-mockup-bar" />
      </div>
      <div className="cp-mockup-body">
        <div className="cp-mockup-sidebar">
          <div className="cp-mockup-row" style={{ background: B[200], width: "75%" }} />
          <div className="cp-mockup-row" />
          <div className="cp-mockup-row" />
          <div className="cp-mockup-row" style={{ width: "60%" }} />
        </div>
        <div className="cp-mockup-content">
          <div className="cp-mockup-headline" style={{ width: "42%" }} />
          <div className="cp-mockup-grid">
            <div className="cp-mockup-tile" />
            <div className="cp-mockup-tile" />
            <div className="cp-mockup-tile" />
            <div className="cp-mockup-tile" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MarketingHomePage() {
  return (
    <div className="overflow-hidden bg-white">

      {/* ── Sticky nav ────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200/70">
        <div className="cp-container h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg grid place-items-center text-white font-extrabold text-sm"
              style={{ background: B[800] }}
            >
              C
            </div>
            <span className="font-bold text-[#0f1f3d] text-[0.95rem] tracking-tight">Canopy</span>
          </div>
          <nav className="hidden md:flex items-center gap-7">
            <a href="#products" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              Products
            </a>
            <Link href="/sign-in" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              Sign in
            </Link>
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cp-btn text-white text-sm font-semibold px-5 py-2 rounded-full"
              style={{ background: B[600] }}
            >
              Book a demo
            </a>
          </nav>
          <Link href="/sign-in" className="md:hidden text-sm font-semibold text-[#0f1f3d]">
            Sign in
          </Link>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: B[800],
          backgroundImage: [
            // Dot grid
            "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
            // Warm glow top-right
            "radial-gradient(ellipse 65% 50% at 75% -10%, rgba(255,120,50,0.35) 0%, transparent 60%)",
            // Subtle glow bottom-left
            "radial-gradient(ellipse 40% 35% at 0% 100%, rgba(255,80,0,0.18) 0%, transparent 65%)",
          ].join(", "),
          backgroundSize: "28px 28px, auto, auto",
        }}
      >
        {/* Decorative rings */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Large ring — top right */}
          <div
            className="absolute rounded-full border border-white/10"
            style={{ width: 520, height: 520, top: -160, right: -100 }}
          />
          {/* Medium ring — offset inside the large */}
          <div
            className="absolute rounded-full border border-white/[0.07]"
            style={{ width: 340, height: 340, top: -60, right: 0 }}
          />
          {/* Small filled blob — bottom right */}
          <div
            className="absolute rounded-full"
            style={{
              width: 180,
              height: 180,
              bottom: -60,
              right: "12%",
              background: "rgba(255,100,0,0.18)",
              filter: "blur(40px)",
            }}
          />
          {/* Diagonal rule line */}
          <div
            className="absolute"
            style={{
              width: 1,
              height: "140%",
              top: "-20%",
              right: "38%",
              background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.06) 40%, transparent)",
              transform: "rotate(12deg)",
            }}
          />
        </div>
        <div className="cp-container py-20 lg:py-28 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left — copy + CTAs */}
            <div>
              <p className="cp-eyebrow mb-5" style={{ color: B[300] }}>
                From Akkedis Digital — built for adult education
              </p>
              <h1 className="cp-hero-headline text-white mb-6">
                Better tools.<br />Stronger schools.
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed mb-10 max-w-[42ch]">
                Everything you need to organize your brand assets, turn student
                successes into polished content, and publish to every channel —
                from one platform built for adult education.
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                <a
                  href={DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cp-btn text-white font-semibold px-7 py-3.5 rounded-full"
                  style={{ background: B[600] }}
                >
                  Book a free demo
                </a>
                <Link
                  href="/sign-in"
                  className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
                >
                  Sign in to your workspace <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right — hero mockup (desktop only) */}
            <div className="hidden lg:block">
              <ProductMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust band ────────────────────────────── */}
      <div className="bg-slate-50 border-b border-slate-100 py-4">
        <div className="cp-container flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-center">
          <span className="font-semibold text-slate-700">Trusted by adult education schools</span>
          <span className="text-slate-300 hidden sm:inline">&middot;</span>
          <span className="text-slate-400 hidden sm:inline">ESL programs &middot; Workforce training &middot; Adult diploma tracks &middot; Community schools</span>
        </div>
      </div>

      {/* ── Products overview ─────────────────────── */}
      <section className="py-20 lg:py-28" id="products">
        <div className="cp-container">
          <div className="text-center mb-14">
            <p className="cp-eyebrow mb-4">Three tools, one platform</p>
            <h2 className="cp-section-headline text-[#0f1f3d]">
              Every interaction shapes<br className="hidden sm:block" /> the school experience.
            </h2>
          </div>

          {/* Accordion — uses native <details> for zero-JS expand/collapse */}
          <div className="divide-y divide-slate-100 border-y border-slate-100 mb-14">
            {liveProducts.map(({ key, Icon, eyebrow, accentColor, accentBg, headline, body }) => (
              <details key={key} className="group">
                <summary className="cp-accordion-summary">
                  <span
                    className="w-10 h-10 rounded-xl grid place-items-center shrink-0"
                    style={{ background: accentBg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: accentColor }} />
                  </span>
                  <span className="flex-1 font-semibold text-[#0f1f3d]">{eyebrow}</span>
                  <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 group-open:rotate-90" />
                </summary>
                <div className="pb-8 pt-2">
                  <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    <div>
                      <h3 className="font-bold text-[#0f1f3d] text-xl leading-snug mb-3">{headline}</h3>
                      <p className="text-slate-600 leading-relaxed mb-6">{body}</p>
                      <a
                        href={DEMO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                        style={{ color: accentColor }}
                      >
                        See it in action <ChevronRight className="w-4 h-4" />
                      </a>
                    </div>
                    <ProductMockup />
                  </div>
                </div>
              </details>
            ))}
          </div>

          {/* Coming-soon strip */}
          <p className="cp-eyebrow text-center mb-6">Coming soon</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {comingSoon.map(({ Icon, label, desc }) => (
              <div key={label} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-start gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-100 grid place-items-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-slate-400" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#0f1f3d] mb-0.5">{label}</p>
                  <p className="text-xs text-slate-400 leading-snug">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature: Stories ──────────────────────── */}
      <section
        className="border-y py-20 lg:py-28"
        style={{ background: B[50], borderColor: B[100] }}
      >
        <div className="cp-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="cp-eyebrow mb-4" style={{ color: B[700] }}>Canopy Stories — AI Content Production</p>
              <h2 className="cp-feature-headline mb-5">
                Your school&apos;s stories,<br />told well.
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Build school pride, grow community support, and drive student
                success. One intake form becomes a blog post, newsletter feature,
                social content, and a short video — ready for your review before
                anything goes public.
              </p>
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="cp-btn inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-full"
                style={{ background: B[700] }}
              >
                See Canopy Stories <ChevronRight className="w-4 h-4" />
              </a>
            </div>
            <ProductMockup />
          </div>
        </div>
      </section>

      {/* ── Feature: PhotoVault ───────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="cp-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <ProductMockup />
            </div>
            <div className="order-1 lg:order-2">
              <p className="cp-eyebrow mb-4">PhotoVault by Canopy — Photo &amp; Asset Management</p>
              <h2 className="cp-feature-headline mb-5">
                Instant access to every<br />approved asset.
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Make it easier than ever for your team to find the right photos
                and brand files. Everything uploaded is organized, searchable, and
                cleared for use — so no one ever publishes the wrong thing.
              </p>
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="cp-btn inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-full"
                style={{ background: B[800] }}
              >
                See PhotoVault <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature: Reach ────────────────────────── */}
      <section
        className="border-y py-20 lg:py-28"
        style={{ background: B[100], borderColor: B[200] }}
      >
        <div className="cp-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="cp-eyebrow mb-4" style={{ color: B[600] }}>Canopy Reach — Social Media Publishing</p>
              <h2 className="cp-feature-headline mb-5">
                Reach your community<br />anytime, everywhere.
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Connect your school&apos;s social accounts and manage your entire
                publishing calendar from one dashboard. Write, schedule, and
                publish to every channel — with your team coordinated and your
                brand consistent.
              </p>
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="cp-btn inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-full"
                style={{ background: B[600] }}
              >
                See Canopy Reach <ChevronRight className="w-4 h-4" />
              </a>
            </div>
            <ProductMockup />
          </div>
        </div>
      </section>

      {/* ── Why Canopy ────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="cp-container">
          <div className="text-center mb-14">
            <p className="cp-eyebrow mb-4">Why Canopy</p>
            <h2 className="cp-section-headline text-[#0f1f3d]">
              Built for adult education<br className="hidden sm:block" /> marketing teams.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {differentiators.map((d) => (
              <div key={d.n} className="rounded-2xl p-7" style={{ background: B[50] }}>
                <p className="text-3xl font-extrabold mb-4 tracking-tight" style={{ color: B[200] }}>{d.n}</p>
                <h3 className="font-bold text-[#0f1f3d] text-lg mb-3">{d.title}</h3>
                <p className="text-slate-600 leading-relaxed">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Founder ───────────────────────────────── */}
      <section className="border-y border-slate-100 bg-slate-50 py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row gap-10 items-start sm:items-center">
            {/* Replace with <Image> once photo is available */}
            <div
              className="w-20 h-20 rounded-full bg-slate-200 shrink-0 self-center sm:self-start sm:mt-1"
              aria-label="Photo of the founder"
            />
            <div>
              <p className="cp-eyebrow mb-4">About Canopy</p>
              <h2 className="font-bold text-[#0f1f3d] text-2xl leading-snug mb-4">
                Built by someone who&apos;s done this work.
              </h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                Canopy comes from years of doing this work firsthand — building websites,
                writing newsletters, managing photos, and publishing social media for adult
                education schools across the Bay Area. Every workflow in Canopy exists
                because it was run by hand first.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                Now your team can use the same tools directly.
              </p>
              <a
                href="https://akkedisdigital.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f1f3d] border border-slate-300 hover:border-slate-500 px-5 py-2.5 rounded-full transition-colors"
              >
                Akkedis Digital — full-service marketing for schools <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────── */}
      <section
        className="py-20 lg:py-28 relative overflow-hidden"
        style={{
          background: B[800],
          backgroundImage:
            "radial-gradient(ellipse 55% 45% at 50% 0%, rgba(255,120,50,0.25) 0%, transparent 70%)",
        }}
      >
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="cp-section-headline mb-5" style={{ color: "white" }}>
            Meet the schools who love<br className="hidden sm:block" /> working with Canopy.
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-[44ch] mx-auto">
            Book a 20-minute demo and see how Canopy can work for your school.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-slate-100 font-semibold px-8 py-4 rounded-full transition-colors"
              style={{ color: B[800] }}
            >
              Book a free demo
            </a>
            <Link
              href="/sign-in"
              className="text-slate-300 hover:text-white py-4 px-2 transition-colors flex items-center gap-1.5 text-sm"
            >
              Sign in to your workspace <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-slate-500 text-sm mt-8">
            Questions?{" "}
            <a
              href="mailto:info@usecanopy.school"
              className="text-white/40 hover:text-white/70 underline decoration-white/20 transition-colors"
            >
              info@usecanopy.school
            </a>
          </p>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="cp-container flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-[5px] grid place-items-center text-white text-[0.65rem] font-extrabold"
              style={{ background: B[800] }}
            >
              C
            </div>
            <span className="text-sm font-semibold text-[#0f1f3d]">Canopy</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-slate-400">
            <a href="#products" className="hover:text-slate-600 transition-colors">Products</a>
            <Link href="/sign-in" className="hover:text-slate-600 transition-colors">Sign in</Link>
            <a href="mailto:info@usecanopy.school" className="hover:text-slate-600 transition-colors">Contact</a>
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Akkedis Digital. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
