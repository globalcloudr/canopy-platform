import { Button } from "@canopy/ui";
import Link from "next/link";

const allProducts = [
  { key: "photovault",        name: "PhotoVault by Canopy", desc: "Organize approved school photos, logos, and brand assets in one shared library.", color: "#0f1f3d" },
  { key: "community",         name: "Canopy Community",     desc: "Create and send recurring newsletters that keep your school community informed.", color: "#7c3aed" },
  { key: "reach",             name: "Canopy Reach",         desc: "Write, schedule, and publish social posts to Facebook, Instagram, LinkedIn, and more.", color: "#db2777" },
  { key: "stories",           name: "Canopy Stories",       desc: "Turn student successes into blog posts, social content, and short video — automatically.", color: "#d97706" },
  { key: "publish",           name: "Canopy Publish",       desc: "Give schools a digital home for class catalogs, brochures, and program guides.", color: "#0369a1" },
  { key: "create",            name: "Canopy Create",        desc: "Submit design requests, track revisions, and download finished files — all in one place.", color: "#ea580c" },
  { key: "web",               name: "Canopy Website",       desc: "Publish school websites and program pages that stay current and on-brand.", color: "#0d9488" },
  { key: "assist",            name: "Canopy Assistant",     desc: "Give staff a smart assistant for drafting communications and answering everyday questions.", color: "#4f46e5" },
  { key: "insights",          name: "Canopy Insights",      desc: "Track campaign performance, social reach, and school visibility across every channel.", color: "#16a34a" },
];

const differentiators = [
  {
    n: "01",
    title: "One platform for school communications",
    body: "Canopy brings newsletters, social media, websites, stories, and publications into one platform with one login and one dashboard.",
  },
  {
    n: "02",
    title: "Built for adult education",
    body: "Designed for ESL, workforce, and adult diploma programs — not K-12. Every workflow reflects how adult education marketing actually works.",
  },
  {
    n: "03",
    title: "Canopy does the work",
    body: "From setup to sending, Canopy handles the heavy lifting. Your team gets consistent output without the operational overhead.",
  },
];

export default function MarketingHomePage() {
  return (
    <div className="overflow-hidden">

      {/* ── Dark hero band ───────────────────────────── */}
      <div className="marketing-hero-band">
        <div className="max-w-[1160px] mx-auto px-6 max-[580px]:px-4">

          {/* Nav */}
          <nav className="flex items-center justify-between py-[22px]">
            <div className="flex items-center gap-2.5 no-underline text-white">
              <div className="grid place-items-center w-8 h-8 rounded-[7px] bg-white/12 text-white text-[0.95rem] font-extrabold tracking-[-0.02em]">
                C
              </div>
              <p className="m-0 text-white text-[0.95rem] font-bold tracking-[-0.01em]">Canopy</p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="#products"
                className="text-sm font-medium text-white/60 no-underline px-3 py-1.5 rounded-md transition-colors hover:text-white hover:bg-white/8"
              >
                Products
              </a>
              <Button asChild variant="blue">
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </div>
          </nav>

          {/* Hero */}
          <section className="py-20 pb-24 max-w-[700px] relative max-[580px]:py-14 max-[580px]:pb-18">
            <p className="eyebrow" style={{ color: "var(--blue)", opacity: 0.9 }}>School growth platform</p>
            <h1 className="text-white mb-5">
              Everything your school needs to communicate, grow, and get noticed.
            </h1>
            <p className="text-white/65 text-[1.1rem] leading-[1.7] mb-9 max-w-[52ch]">
              Canopy brings newsletters, social media, success stories, publications,
              and design into one connected platform — built for adult education schools.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <Button asChild variant="blue" size="lg">
                <Link href="/sign-in">Sign in to your workspace</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="border-white/20 bg-transparent text-white/85 shadow-none hover:border-white/45 hover:bg-white/5 hover:text-white"
              >
                <Link href="#products">Explore the products →</Link>
              </Button>
            </div>
          </section>

          {/* Floating product blobs */}
          <div className="hero-floats" aria-hidden="true">
            <div className="hero-float" style={{ background: "#7c3aed", top: "18%", right: "8%",  width: 52, height: 52, animationDelay: "0s" }}>C</div>
            <div className="hero-float" style={{ background: "#db2777", top: "52%", right: "18%", width: 40, height: 40, animationDelay: "0.6s" }}>R</div>
            <div className="hero-float" style={{ background: "#d97706", top: "72%", right: "6%",  width: 36, height: 36, animationDelay: "1.1s" }}>S</div>
            <div className="hero-float" style={{ background: "#0369a1", top: "35%", right: "28%", width: 30, height: 30, animationDelay: "0.3s" }}>P</div>
            <div className="hero-float" style={{ background: "#0d9488", top: "62%", right: "32%", width: 26, height: 26, animationDelay: "0.9s" }}>W</div>
          </div>
        </div>
      </div>

      {/* ── Light content area ───────────────────────── */}
      <div className="max-w-[1160px] mx-auto px-6 pb-20 max-[580px]:px-4">

        {/* Product grid */}
        <section className="pt-18 mb-20" id="products">
          <p className="eyebrow">The platform</p>
          <h2>Nine tools to grow your school. One centralized dashboard.</h2>
          <p className="text-muted text-[0.9rem] max-w-[44ch] mt-2 mb-0">
            A connected platform for the products and services your school uses every day.
          </p>
          <div className="grid grid-cols-3 gap-3 mt-9 max-[960px]:grid-cols-2 max-[580px]:grid-cols-1">
            {allProducts.map((product) => (
              <div
                key={product.key}
                className="bg-surface border border-[rgba(15,31,61,0.1)] rounded-[14px] p-7 pb-6 flex flex-col transition-[box-shadow,border-color,transform] duration-200 hover:shadow-[0_4px_12px_rgba(15,31,61,0.08),0_2px_4px_rgba(15,31,61,0.05)] hover:border-[rgba(15,31,61,0.18)] hover:-translate-y-0.5"
              >
                <div
                  className="grid place-items-center w-11 h-11 rounded-[11px] text-white text-[1.05rem] font-extrabold tracking-[-0.02em] mb-4"
                  style={{ background: product.color }}
                  aria-hidden="true"
                >
                  {product.name[0]}
                </div>
                <h3 className="text-[0.95rem] mb-1.5">{product.name}</h3>
                <p className="text-[0.845rem] text-muted m-0 leading-relaxed">{product.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Canopy */}
        <section className="pt-18 pb-20 border-t border-[rgba(15,31,61,0.1)]">
          <p className="eyebrow">Why Canopy</p>
          <h2>Built for adult education marketing teams.</h2>
          <div className="grid grid-cols-3 gap-8 mt-9 max-[840px]:grid-cols-1 max-[840px]:gap-6">
            {differentiators.map((d) => (
              <div key={d.n}>
                <p className="m-0 mb-3 text-xs font-extrabold tracking-[0.08em] text-blue">{d.n}</p>
                <h3 className="text-[1.05rem] font-bold mb-2.5">{d.title}</h3>
                <p className="text-[0.9rem] text-muted leading-[1.7] m-0">{d.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="pt-18 border-t border-[rgba(15,31,61,0.1)] text-center">
          <h2 className="mb-3">Ready to get started?</h2>
          <p className="text-muted text-[0.9rem] mb-7 max-w-[44ch] mx-auto">
            Sign in to your workspace or contact Canopy to set up your account.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button asChild variant="primary">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <a
              className="text-sm font-medium text-muted no-underline transition-colors hover:text-ink"
              href="mailto:info@akkedisdigital.com"
            >
              Contact us →
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
