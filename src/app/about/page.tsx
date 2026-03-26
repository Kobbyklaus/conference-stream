import Link from "next/link";
/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | 190 Nations Office",
  description: "Learn about the 190 Nations Office and the ministry of Dag Heward-Mills.",
};

const timeline = [
  { year: "1988", event: "Dag Heward-Mills begins Lighthouse Chapel International in Accra, Ghana" },
  { year: "1999", event: "First international church plants — the vision for all nations takes root" },
  { year: "2005", event: "Book distribution reaches 1 million copies worldwide" },
  { year: "2010", event: "Healing Jesus Campaigns launch across Africa, reaching millions" },
  { year: "2015", event: "190 Nations Office established to coordinate global pastoral outreach" },
  { year: "2020", event: "Online conferences begin, connecting pastors across continents weekly" },
  { year: "2025", event: "8 million+ books distributed; pastoral network spans 99 countries" },
  { year: "2026", event: "Weekly online pastoral conferences now reaching every continent" },
];

const values = [
  {
    title: "Loyalty to God's Call",
    description: "We believe every pastor has a divine calling and we exist to help them fulfil it faithfully.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  {
    title: "Free Resources",
    description: "All books, conferences, and materials are provided completely free. Ministry should never be limited by finances.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    title: "Global Unity",
    description: "We connect pastors across denominational, cultural, and geographic boundaries for mutual encouragement.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
  {
    title: "Practical Equipping",
    description: "Our resources focus on real-world pastoral challenges: leadership, church growth, loyalty, and shepherding.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-5.1m0 0L11.42 4.97m-5.1 5.1h13.36M4.26 19.22h15.48" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 0115 0" />
      </svg>
    ),
  },
];

const books = [
  "Loyalty and Disloyalty",
  "The Art of Leadership",
  "Church Planting",
  "Catch the Anointing",
  "The Art of Shepherding",
  "What It Means to Become a Shepherd",
  "The Mega Church",
  "Transform Your Pastoral Ministry",
  "Many Are Called",
  "Steps to the Anointing",
];

export default function About() {
  return (
    <main>
      {/* Hero */}
      <section className="relative py-28 sm:py-36 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/bishop-dag-preaching.jpg" alt="" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/40 via-slate-950/80 to-slate-950" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <p className="animate-fade-in text-amber-300/90 italic text-base sm:text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
            &ldquo;And he gave some, apostles; and some, prophets; and some, evangelists; and some, pastors and teachers; for the perfecting of the saints&rdquo;
            <span className="block mt-2 text-amber-400/70 not-italic text-sm font-medium tracking-wide">
              — Ephesians 4:11-12
            </span>
          </p>
          <h1 className="animate-fade-in-delay text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-gradient-warm">
            About 190 Nations Office
          </h1>
          <p className="animate-fade-in-delay-2 text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A ministry born from the vision of reaching every nation with
            pastoral resources, leadership training, and the transformative
            power of God&apos;s Word.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <img
                src="/images/bishop-dag-stage.jpg"
                alt="Bishop Dag Heward-Mills preaching"
                className="w-full h-auto rounded-2xl object-cover shadow-2xl shadow-amber-900/20"
              />
            </div>
            <div className="animate-slide-in-right">
              <div className="inline-block bg-amber-600/20 border border-amber-500/30 rounded-full px-4 py-1.5 text-amber-300 text-sm font-medium mb-4">
                Our Mission
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gradient-warm">
                Equipping Pastors to Change Nations
              </h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                The 190 Nations Office is the global outreach arm of Bishop Dag
                Heward-Mills&apos; ministry. Our mission is simple: to equip
                every pastor and church leader with the tools they need to
                effectively shepherd their flock and expand God&apos;s Kingdom.
              </p>
              <p className="text-gray-400 mb-4 leading-relaxed">
                We achieve this through three pillars: <strong className="text-amber-300">free book distribution</strong> (over
                8 million copies in multiple languages), <strong className="text-amber-300">weekly online
                pastoral conferences</strong> connecting leaders from every
                continent, and <strong className="text-amber-300">strategic partnerships</strong> with local
                churches to host conferences and distribute resources in their
                communities.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Bishop Dag Heward-Mills is a bestselling author with over 100
                titles on pastoral ministry, leadership, loyalty, and church
                growth. His books have been translated into over 50 languages
                and have impacted millions of lives worldwide.
              </p>

              {/* Popular Books */}
              <div className="mt-8 glass-card rounded-2xl p-6 border border-amber-500/10">
                <h3 className="text-lg font-semibold mb-4 text-amber-400">
                  Popular Titles
                </h3>
                <div className="space-y-3">
                  {books.map((book) => (
                    <div
                      key={book}
                      className="flex items-center gap-3 text-gray-300"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span>{book}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/books"
                  className="mt-6 inline-block text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
                >
                  View full library &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-block bg-amber-600/20 border border-amber-500/30 rounded-full px-4 py-1.5 text-amber-300 text-sm font-medium mb-4">
              What Guides Us
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gradient-warm">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div
                key={v.title}
                className={`glass-card card-warm-hover rounded-2xl p-6 border border-amber-500/10 ${
                  i === 0 ? "animate-fade-in" : i === 1 ? "animate-fade-in-delay" : i === 2 ? "animate-fade-in-delay-2" : "animate-fade-in-delay-2"
                }`}
              >
                <div className="w-14 h-14 rounded-xl bg-amber-600/20 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                  {v.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-block bg-amber-600/20 border border-amber-500/30 rounded-full px-4 py-1.5 text-amber-300 text-sm font-medium mb-4">
              Since 1988
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gradient-warm">Our Journey</h2>
          </div>
          <div className="space-y-6">
            {timeline.map((t) => (
              <div key={t.year} className="flex gap-6 group">
                <div className="text-amber-400 font-bold text-lg w-16 shrink-0 text-right transition-colors group-hover:text-amber-300">
                  {t.year}
                </div>
                <div className="relative pl-6 border-l-2 border-amber-900/50 pb-2 group-hover:border-amber-600/50 transition-colors">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-amber-600 border-2 border-slate-950 shadow-lg shadow-amber-600/30 group-hover:animate-warm-glow transition-all" />
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors">{t.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-amber-950/30 via-slate-900/50 to-blue-950/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gradient-warm">Join the Mission</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Whether you&apos;re a pastor looking for resources or a church leader
            wanting to partner with us, we&apos;d love to connect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3.5 rounded-xl text-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-amber-600/25"
            >
              Contact Us
            </Link>
            <Link
              href="/conferences"
              className="bg-blue-600/80 hover:bg-blue-500 border border-blue-500/30 text-white px-8 py-3.5 rounded-xl text-lg font-semibold transition-all hover:scale-105"
            >
              Join a Conference
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
