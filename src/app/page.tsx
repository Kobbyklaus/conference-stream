import Link from "next/link";
/* eslint-disable @next/next/no-img-element */

const stats = [
  {
    label: "Nations Reached",
    value: "190+",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9 9 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
  {
    label: "Pastors Connected",
    value: "1,600+",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    label: "Books Distributed",
    value: "8M+",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    label: "Weekly Conferences",
    value: "Every Sat",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
];

const regions = [
  { name: "South America", countries: 11, contacts: 515, color: "from-green-500 to-emerald-600" },
  { name: "North America", countries: 3, contacts: 294, color: "from-blue-500 to-indigo-600" },
  { name: "Asia", countries: 14, contacts: 233, color: "from-orange-500 to-red-600" },
  { name: "Europe", countries: 23, contacts: 198, color: "from-purple-500 to-violet-600" },
  { name: "Africa", countries: 16, contacts: 145, color: "from-yellow-500 to-amber-600" },
  { name: "Middle East", countries: 11, contacts: 70, color: "from-rose-500 to-pink-600" },
  { name: "Oceania", countries: 6, contacts: 66, color: "from-cyan-500 to-teal-600" },
  { name: "Caribbean", countries: 8, contacts: 65, color: "from-fuchsia-500 to-purple-600" },
  { name: "Central America", countries: 7, contacts: 41, color: "from-lime-500 to-green-600" },
];

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
    title: "Weekly Pastoral Conferences",
    description: "Join pastors from around the world every Saturday for teaching, fellowship, and encouragement. Free and open to all church leaders.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    title: "Free Ministry Books",
    description: "Access the complete library of Dag Heward-Mills' books on leadership, church planting, loyalty, and pastoral ministry — completely free.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9 9 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: "Global Pastor Network",
    description: "Connect with a network of 1,600+ pastors across 99 countries. Share experiences, pray together, and build lasting partnerships.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    title: "Church Partnerships",
    description: "Partner with 190 Nations to host local conferences, distribute books, and strengthen the church in your city and nation.",
  },
];

const conferences = [
  { country: "Chile", image: "/images/conf-chile.jpeg" },
  { country: "Dominican Republic", image: "/images/conf-dominican.jpeg" },
  { country: "Honduras", image: "/images/conf-honduras.jpeg" },
  { country: "Uruguay", image: "/images/conf-uruguay.jpeg" },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/bishop-dag-conference.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-blue-950/80 to-slate-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 via-transparent to-blue-900/20" />
        </div>
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-400/30 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <div className="mb-8">
              <img src="/images/dhm-logo-white.gif" alt="DHM All Nations" className="h-20 mx-auto opacity-90" />
            </div>
            <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-400/30 rounded-full px-5 py-2 text-amber-200 text-sm font-medium mb-8">
              <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              Equipping Pastors Across Every Nation
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="text-gradient-warm">
                190 Nations Office
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 mb-4 max-w-3xl mx-auto leading-relaxed">
              A global ministry dedicated to equipping pastors and church leaders
              with the resources they need to fulfil their calling.
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              Through the ministry of Bishop Dag Heward-Mills, we provide free
              books, weekly conferences, and a worldwide network of pastoral
              support spanning 99 countries.
            </p>
          </div>
          <div className="animate-fade-in-delay flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/conferences"
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105 animate-warm-glow"
            >
              Join This Week&apos;s Conference
            </Link>
            <Link
              href="/books"
              className="bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-100 px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105"
            >
              Get Free Books
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in-delay-2">
          <svg className="w-6 h-6 text-amber-400/60 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-b from-slate-950 to-slate-900/80 border-y border-amber-400/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card rounded-2xl p-6 text-center animate-scale-in">
                <div className="text-amber-400/80 mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-amber-400 mb-1 animate-count-up">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-gradient-warm">What We Offer</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything a pastor needs to grow in ministry, completely free of
              charge.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="card-warm-hover bg-gradient-to-b from-slate-900 to-slate-900/50 border border-slate-800 rounded-2xl p-6"
              >
                <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-5">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-100">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Reach */}
      <section className="py-24 bg-gradient-to-b from-slate-900/30 to-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-gradient-blue">Our Global Reach</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Connected with pastors and churches across 99 countries and 9
              regions.
            </p>
          </div>
          <div className="mb-14 animate-fade-in-delay">
            <img src="/images/world-map.svg?v=3" alt="Global reach map showing pastor connections worldwide" className="w-full h-auto rounded-xl" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {regions.map((r) => (
              <div
                key={r.name}
                className="card-warm-hover glass-card rounded-xl p-5 flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${r.color} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg`}
                >
                  {r.contacts}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-100">{r.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {r.countries} countries &middot; {r.contacts} churches
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <p className="text-gray-500 text-sm">
              Total: 1,627 churches &amp; pastors across 99 countries
            </p>
          </div>
        </div>
      </section>

      {/* Conference Gallery */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-gradient-warm">Conferences Around the World</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Country-specific pastoral conferences reaching pastors in their own language.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {conferences.map((c) => (
              <div
                key={c.country}
                className="group relative rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-400/40 transition-all hover:-translate-y-1"
              >
                <img src={c.image} alt={`${c.country} Conference`} className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-semibold text-center text-lg">{c.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/bishop-dag-crowd.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-blue-950/85 to-slate-950/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/15 via-transparent to-amber-900/15" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">
            <span className="text-gradient-warm">Ready to Connect?</span>
          </h2>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Whether you&apos;re a pastor seeking resources, a church leader
            looking for partnership, or simply curious about what we do — we&apos;d
            love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 animate-warm-glow"
            >
              Get in Touch
            </Link>
            <Link
              href="/about"
              className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/30 text-blue-100 px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
