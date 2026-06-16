import Link from "next/link";

const NICHES = [
  "Creators", "Coaches", "Realtors", "Musicians",
  "Photographers", "Freelancers", "Job Seekers", "Restaurants",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-xl tracking-tight">LinkHub</span>
        <div className="flex gap-3">
          <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
            Log in
          </Link>
          <Link href="/signup" className="text-sm bg-primary text-primary-foreground rounded-lg px-4 py-2 hover:opacity-90 transition-opacity font-medium">
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 gap-8">
        <div className="flex flex-wrap gap-2 justify-center mb-2">
          {NICHES.map(n => (
            <span key={n} className="text-xs bg-secondary text-secondary-foreground rounded-full px-3 py-1">
              {n}
            </span>
          ))}
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-3xl leading-tight">
          Your bio link should be{" "}
          <span className="text-primary">more than a list.</span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-xl">
          Create a professional mini-website with links, lead capture, products,
          QR code, and analytics — in under 2 minutes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link href="/signup" className="bg-primary text-primary-foreground rounded-xl px-8 py-4 text-lg font-semibold hover:opacity-90 transition-opacity">
            Create your page — free
          </Link>
          <Link href="/u/demo" className="border border-border rounded-xl px-8 py-4 text-lg font-semibold hover:bg-secondary transition-colors">
            See a live example
          </Link>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl w-full">
          {[
            { icon: "🔗", label: "Unlimited links" },
            { icon: "📊", label: "Click analytics" },
            { icon: "📱", label: "QR code included" },
            { icon: "🎨", label: "Premium themes" },
          ].map(f => (
            <div key={f.label} className="bg-card border border-border rounded-xl p-4 flex flex-col items-center gap-2">
              <span className="text-2xl">{f.icon}</span>
              <span className="text-sm font-medium">{f.label}</span>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-border px-6 py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} LinkHub. All rights reserved.
      </footer>
    </div>
  );
}
