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

export default function Books() {
  return (
    <main>
      {/* Hero */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/bishop-dag-quote.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-950/80 via-slate-950/85 to-slate-950" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block bg-purple-600/20 border border-purple-500/30 rounded-full px-4 py-1.5 text-purple-300 text-sm font-medium mb-6">
            Over 8 Million Copies Distributed
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Free Ministry Books
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Access the complete library of Dag Heward-Mills&apos; books on
            leadership, church planting, loyalty, and pastoral ministry —
            available in 50+ languages, completely free.
          </p>
          <Link
            href="/contact"
            className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3.5 rounded-xl text-lg font-semibold transition-all hover:scale-105"
          >
            Request Free Books
          </Link>
          <div className="mt-12 max-w-2xl mx-auto">
            <img src="/images/books-collection.svg" alt="Collection of ministry books by Dag Heward-Mills" className="w-full h-auto rounded-xl" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-400">100+</div>
              <div className="text-gray-400 text-sm">Book Titles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">50+</div>
              <div className="text-gray-400 text-sm">Languages</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">8M+</div>
              <div className="text-gray-400 text-sm">Copies Distributed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">190</div>
              <div className="text-gray-400 text-sm">Nations Reached</div>
            </div>
          </div>
        </div>
      </section>

      {/* Book Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-14">
            Book Library
          </h2>
          <div className="space-y-12">
            {categories.map((cat) => (
              <div key={cat.name}>
                <h3 className="text-xl font-bold text-blue-400 mb-6 pb-2 border-b border-slate-800">
                  {cat.name}
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {cat.books.map((book) => (
                    <div
                      key={book.title}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-purple-500/50 transition-all hover:-translate-y-1"
                    >
                      <div className="w-full h-32 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-4xl">📖</span>
                      </div>
                      <h4 className="font-semibold mb-2">{book.title}</h4>
                      <p className="text-gray-400 text-sm">
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
      <section className="py-20 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Available in 50+ Languages
          </h2>
          <p className="text-gray-400 text-center mb-10">
            Books are being translated into new languages every month.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {languages.map((lang) => (
              <span
                key={lang}
                className="bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5 text-sm text-gray-300"
              >
                {lang}
              </span>
            ))}
            <span className="bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5 text-sm text-gray-500">
              + 26 more...
            </span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Get Your Free Books Today
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Whether you need digital copies for yourself or printed books for
            your congregation, we&apos;ll help you get the resources you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3.5 rounded-xl text-lg font-semibold transition-all hover:scale-105"
            >
              Request Books
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
