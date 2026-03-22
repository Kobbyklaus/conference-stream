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
  },
  {
    title: "Free Resources",
    description: "All books, conferences, and materials are provided completely free. Ministry should never be limited by finances.",
  },
  {
    title: "Global Unity",
    description: "We connect pastors across denominational, cultural, and geographic boundaries for mutual encouragement.",
  },
  {
    title: "Practical Equipping",
    description: "Our resources focus on real-world pastoral challenges: leadership, church growth, loyalty, and shepherding.",
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
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/bishop-dag-preaching.jpg" alt="" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/70 via-slate-950/80 to-slate-950" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            About 190 Nations Office
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
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
            <div>
              <div className="mb-6">
                <img src="/images/bishop-dag-stage.jpg" alt="Bishop Dag Heward-Mills preaching" className="w-full h-auto rounded-xl object-cover" />
              </div>
              <div className="inline-block bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-1.5 text-blue-300 text-sm font-medium mb-4">
                Our Mission
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Equipping Pastors to Change Nations
              </h2>
              <p className="text-gray-300 mb-4">
                The 190 Nations Office is the global outreach arm of Bishop Dag
                Heward-Mills&apos; ministry. Our mission is simple: to equip
                every pastor and church leader with the tools they need to
                effectively shepherd their flock and expand God&apos;s Kingdom.
              </p>
              <p className="text-gray-400 mb-4">
                We achieve this through three pillars: <strong className="text-white">free book distribution</strong> (over
                8 million copies in multiple languages), <strong className="text-white">weekly online
                pastoral conferences</strong> connecting leaders from every
                continent, and <strong className="text-white">strategic partnerships</strong> with local
                churches to host conferences and distribute resources in their
                communities.
              </p>
              <p className="text-gray-400">
                Bishop Dag Heward-Mills is a bestselling author with over 100
                titles on pastoral ministry, leadership, loyalty, and church
                growth. His books have been translated into over 50 languages
                and have impacted millions of lives worldwide.
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h3 className="text-lg font-semibold mb-4 text-blue-400">
                Popular Titles
              </h3>
              <div className="space-y-3">
                {books.map((book) => (
                  <div
                    key={book}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <span className="text-blue-500">📖</span>
                    <span>{book}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/books"
                className="mt-6 inline-block text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                View full library &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold mb-2">{v.title}</h3>
                <p className="text-gray-400 text-sm">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="space-y-6">
            {timeline.map((t) => (
              <div key={t.year} className="flex gap-6">
                <div className="text-blue-400 font-bold text-lg w-16 shrink-0 text-right">
                  {t.year}
                </div>
                <div className="relative pl-6 border-l-2 border-slate-700 pb-2">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue-600 border-2 border-slate-950" />
                  <p className="text-gray-300">{t.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-950/50 to-indigo-950/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Mission</h2>
          <p className="text-gray-400 text-lg mb-8">
            Whether you&apos;re a pastor looking for resources or a church leader
            wanting to partner with us, we&apos;d love to connect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl text-lg font-semibold transition-all hover:scale-105"
            >
              Contact Us
            </Link>
            <Link
              href="/conferences"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3.5 rounded-xl text-lg font-semibold transition-all hover:scale-105"
            >
              Join a Conference
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
