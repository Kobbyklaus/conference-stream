import Link from "next/link";
/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Books | 190 Nations Office",
  description: "Access free pastoral ministry books by Dag Heward-Mills. Leadership, church planting, loyalty, and more.",
};

const categories = [
  {
    name: "Leadership & Ministry",
    books: [
      { title: "The Art of Leadership", description: "Comprehensive guide to effective pastoral and organizational leadership in the church." },
      { title: "Many Are Called", description: "Understanding the call to ministry and how to faithfully respond to God's assignment." },
      { title: "Transform Your Pastoral Ministry", description: "Practical steps to take your pastoral effectiveness to the next level." },
      { title: "The Art of Hearing", description: "How to hear from God and make wise decisions in ministry." },
    ],
  },
  {
    name: "Church Growth & Planting",
    books: [
      { title: "Church Planting", description: "Step-by-step guide to planting and establishing thriving local churches." },
      { title: "The Mega Church", description: "Principles and strategies for growing a large, impactful congregation." },
      { title: "Lay People and the Ministry", description: "How to mobilize and empower lay members for effective ministry." },
      { title: "Steps to the Anointing", description: "How to walk in the anointing and power of God in church ministry." },
    ],
  },
  {
    name: "Loyalty & Character",
    books: [
      { title: "Loyalty and Disloyalty", description: "The foundational text on loyalty — understanding its role in ministry and relationships." },
      { title: "Those Who Leave You", description: "Dealing with people who leave your ministry and how to handle transition." },
      { title: "The Art of Following", description: "The importance of following mentors and leaders faithfully in ministry." },
      { title: "What It Means to Become a Shepherd", description: "The heart and calling of pastoral shepherding in the modern church." },
    ],
  },
  {
    name: "Spiritual Growth",
    books: [
      { title: "Catch the Anointing", description: "How to receive and operate in the anointing for supernatural ministry." },
      { title: "The Art of Shepherding", description: "Caring for God's flock with wisdom, love, and practical skill." },
      { title: "Backsliding", description: "Understanding spiritual decline and how to guard against it in ministry." },
      { title: "Name It, Claim It, Take It!", description: "The power of faith and confession in the life of a believer." },
    ],
  },
];

const languages = [
  "English", "Spanish", "French", "Portuguese", "German", "Italian",
  "Korean", "Chinese", "Japanese", "Hindi", "Swahili", "Arabic",
  "Russian", "Indonesian", "Tagalog", "Thai", "Vietnamese", "Dutch",
  "Polish", "Romanian", "Turkish", "Urdu", "Bengali", "Nepali",
];

const stats = [
  { value: "100+", label: "Book Titles" },
  { value: "50+", label: "Languages" },
  { value: "8M+", label: "Copies Distributed" },
  { value: "190", label: "Nations Reached" },
];

export default function Books() {
  return (
    <main>
      {/* Hero */}
      <section className="relative py-28 sm:py-36 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/bishop-dag-quote.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/50 via-slate-950/85 to-slate-950" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="animate-fade-in inline-block bg-amber-600/20 border border-amber-500/30 rounded-full px-5 py-2 text-amber-300 text-sm font-medium mb-6 shadow-lg shadow-amber-900/20">
            Over 8 Million Copies Distributed
          </div>
          <h1 className="animate-fade-in-delay text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-gradient-warm">
            Free Ministry Books
          </h1>
          <p className="animate-fade-in-delay-2 text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Access the complete library of Dag Heward-Mills&apos; books on
            leadership, church planting, loyalty, and pastoral ministry —
            available in 50+ languages, completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3.5 rounded-xl text-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-purple-600/25"
            >
              Request Free Books
            </Link>
            <Link
              href="/conferences"
              className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3.5 rounded-xl text-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-amber-600/25"
            >
              Join a Conference
            </Link>
          </div>
          <div className="mt-12 max-w-2xl mx-auto animate-scale-in">
            <img src="/images/books-collection.svg" alt="Collection of ministry books by Dag Heward-Mills" className="w-full h-auto rounded-xl" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-gradient-to-r from-amber-950/20 via-slate-900/50 to-amber-950/20 border-y border-amber-500/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="animate-count-up">
                <div className="text-3xl sm:text-4xl font-bold text-amber-400">{stat.value}</div>
                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-block bg-amber-600/20 border border-amber-500/30 rounded-full px-4 py-1.5 text-amber-300 text-sm font-medium mb-4">
              Browse by Category
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gradient-warm">
              Book Library
            </h2>
          </div>
          <div className="space-y-14">
            {categories.map((cat) => (
              <div key={cat.name}>
                <h3 className="text-xl font-bold text-amber-400 mb-6 pb-3 border-b border-amber-500/20 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
                  {cat.name}
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {cat.books.map((book) => (
                    <div
                      key={book.title}
                      className="glass-card card-warm-hover border border-amber-500/10 rounded-xl p-5 transition-all hover:-translate-y-1"
                    >
                      <div className="w-full h-32 bg-gradient-to-br from-amber-900/30 via-slate-800/50 to-blue-900/30 rounded-lg flex items-center justify-center mb-4 border border-amber-500/10">
                        <svg className="w-10 h-10 text-amber-500/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                      </div>
                      <h4 className="font-semibold mb-2 text-white">{book.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {book.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="py-20 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-block bg-amber-600/20 border border-amber-500/30 rounded-full px-4 py-1.5 text-amber-300 text-sm font-medium mb-4">
              Worldwide Reach
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gradient-warm mb-4">
              Available in 50+ Languages
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Books are being translated into new languages every month.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {languages.map((lang) => (
              <span
                key={lang}
                className="glass-card border border-amber-500/10 rounded-full px-4 py-1.5 text-sm text-gray-300 hover:border-amber-500/30 hover:text-amber-300 transition-all cursor-default"
              >
                {lang}
              </span>
            ))}
            <span className="bg-blue-600/20 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm text-blue-300">
              + 26 more...
            </span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-amber-950/30 via-slate-900/50 to-blue-950/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gradient-warm">
            Get Your Free Books Today
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Whether you need digital copies for yourself or printed books for
            your congregation, we&apos;ll help you get the resources you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3.5 rounded-xl text-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-amber-600/25"
            >
              Request Books
            </Link>
            <Link
              href="/conferences"
              className="bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-300 px-8 py-3.5 rounded-xl text-lg font-semibold transition-all hover:scale-105"
            >
              Join a Conference
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
