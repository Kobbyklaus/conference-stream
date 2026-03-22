import Link from "next/link";
/* eslint-disable @next/next/no-img-element */

const stats = [
  { label: "Nations Reached", value: "190+" },
  { label: "Pastors Connected", value: "1,600+" },
  { label: "Books Distributed", value: "8M+" },
  { label: "Weekly Conferences", value: "Every Sat" },
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
    icon: "🎤",
    title: "Weekly Pastoral Conferences",
    description: "Join pastors from around the world every Saturday for teaching, fellowship, and encouragement. Free and open to all church leaders.",
  },
  {
    icon: "📚",
    title: "Free Ministry Books",
    description: "Access the complete library of Dag Heward-Mills' books on leadership, church planting, loyalty, and pastoral ministry — completely free.",
  },
  {
    icon: "🌍",
    title: "Global Pastor Network",
    description: "Connect with a network of 1,600+ pastors across 99 countries. Share experiences, pray together, and build lasting partnerships.",
  },
  {
    icon: "🤝",
    title: "Church Partnerships",
    description: "Partner with 190 Nations to host local conferences, distribute books, and strengthen the church in your city and nation.",
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/bishop-dag-conference.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/80 to-slate-950" />
        </div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <div className="mb-6">
              <img src="/images/dhm-logo-white.gif" alt="DHM All Nations" className="h-16 mx-auto opacity-90" />
            </div>
            <div className="inline-block bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-1.5 text-blue-300 text-sm font-medium mb-6">
              Equipping Pastors Across Every Nation
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                190 Nations Office
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
              A global ministry dedicated to equipping pastors and church leaders
              with the resources they need to fulfil their calling.
            </p>
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
              Through the ministry of Bishop Dag Heward-Mills, we provide free
              books, weekly conferences, and a worldwide network of pastoral
              support spanning 99 countries.
            </p>
          </div>
          <div className="animate-fade-in-delay flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/conferences"
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl text-lg font-semibold transition-all hover:scale-105 animate-pulse-glow"
            >
              Join This Week&apos;s Conference
            </Link>
            <Link
              href="/books"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3.5 rounded-xl text-lg font-semibold transition-all hover:scale-105"
            >
              Get Free Books
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-1 animate-count-up">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What We Offer
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
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Reach */}
      <section className="py-20 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our Global Reach
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Connected with pastors and churches across 99 countries and 9
              continents.
            </p>
          </div>
          <div className="mb-12">
            <img src="/images/world-map.svg?v=3" alt="Global reach map showing pastor connections worldwide" className="w-full h-auto rounded-xl" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {regions.map((r) => (
              <div
                key={r.name}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4 hover:border-slate-700 transition-colors"
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${r.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}
                >
                  {r.contacts}
                </div>
                <div>
                  <h3 className="font-semibold">{r.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {r.countries} countries &middot; {r.contacts} churches
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              Total: 1,627 churches &amp; pastors across 99 countries
            </p>
          </div>
        </div>
      </section>

      {/* Conference Gallery */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Conferences Around the World
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Country-specific pastoral conferences reaching pastors in their own language.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl overflow-hidden border border-slate-800 hover:border-blue-500/50 transition-all hover:-translate-y-1">
              <img src="/images/conf-chile.jpeg" alt="Chile Conference" className="w-full h-64 object-cover" />
              <div className="p-3 bg-slate-900"><p className="text-sm font-medium text-center">Chile</p></div>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-800 hover:border-blue-500/50 transition-all hover:-translate-y-1">
              <img src="/images/conf-dominican.jpeg" alt="Dominican Republic Conference" className="w-full h-64 object-cover" />
              <div className="p-3 bg-slate-900"><p className="text-sm font-medium text-center">Dominican Republic</p></div>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-800 hover:border-blue-500/50 transition-all hover:-translate-y-1">
              <img src="/images/conf-honduras.jpeg" alt="Honduras Conference" className="w-full h-64 object-cover" />
              <div className="p-3 bg-slate-900"><p className="text-sm font-medium text-center">Honduras</p></div>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-800 hover:border-blue-500/50 transition-all hover:-translate-y-1">
              <img src="/images/conf-uruguay.jpeg" alt="Uruguay Conference" className="w-full h-64 object-cover" />
              <div className="p-3 bg-slate-900"><p className="text-sm font-medium text-center">Uruguay</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/bishop-dag-crowd.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-950/80" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Connect?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Whether you&apos;re a pastor seeking resources, a church leader
            looking for partnership, or simply curious about what we do — we&apos;d
            love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl text-lg font-semibold transition-all hover:scale-105"
            >
              Get in Touch
            </Link>
            <Link
              href="/about"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3.5 rounded-xl text-lg font-semibold transition-all hover:scale-105"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
