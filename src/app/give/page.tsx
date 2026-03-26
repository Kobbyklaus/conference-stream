import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Give | 190 Nations Office",
  description:
    "Support the mission of equipping pastors and distributing books to leaders in over 190 nations.",
};

const impactStats = [
  { value: "190+", label: "Nations Reached" },
  { value: "1M+", label: "Books Distributed" },
  { value: "10,000+", label: "Pastors Equipped" },
  { value: "Weekly", label: "Conferences Held" },
];

const waysToGive = [
  {
    title: "One-Time Gift",
    description:
      "Make a single donation to support book distribution, conferences, and pastor training around the world.",
    icon: (
      <svg
        className="w-8 h-8 text-amber-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.25-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
        />
      </svg>
    ),
  },
  {
    title: "Monthly Partner",
    description:
      "Become a recurring supporter and help sustain ongoing ministry to pastors and church leaders every month.",
    icon: (
      <svg
        className="w-8 h-8 text-amber-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
        />
      </svg>
    ),
  },
  {
    title: "Book Sponsorship",
    description:
      "Sponsor the printing and distribution of books for pastors in a specific country or region of your choice.",
    icon: (
      <svg
        className="w-8 h-8 text-amber-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
        />
      </svg>
    ),
  },
];

const allocation = [
  { label: "Book Distribution", percentage: 40, color: "from-amber-400 to-amber-500" },
  { label: "Conference Hosting", percentage: 25, color: "from-amber-500 to-amber-600" },
  { label: "Pastor Training", percentage: 20, color: "from-amber-600 to-amber-700" },
  { label: "Operations", percentage: 15, color: "from-amber-700 to-amber-800" },
];

const testimonials = [
  {
    quote:
      "The books I received transformed my understanding of ministry. I now lead my congregation with greater confidence and biblical depth. My church has grown from 30 to over 200 members.",
    name: "Pastor Emmanuel K.",
    location: "Nairobi, Kenya",
  },
  {
    quote:
      "Through the weekly conferences and free resources, I have been equipped to train other pastors in my region. What started as one church is now a network of 15 churches across three provinces.",
    name: "Pastor Maria S.",
    location: "Manila, Philippines",
  },
];

export default function GivePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/30 via-slate-950/80 to-slate-950" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center animate-fade-in">
          <div className="inline-block bg-amber-600/20 border border-amber-500/30 rounded-full px-4 py-1.5 text-amber-300 text-sm font-medium mb-6">
            Partner With Us
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gradient-warm">Support the Mission</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Your generosity helps us reach pastors and church leaders across the
            globe with free books, training conferences, and ministry resources.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
          >
            Contact Us to Give
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 border-y border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map((stat, i) => (
              <div
                key={stat.label}
                className={`text-center animate-fade-in${
                  i === 0
                    ? ""
                    : i === 1
                    ? "-delay"
                    : i === 2
                    ? "-delay-2"
                    : "-delay-3"
                }`}
              >
                <div className="text-3xl sm:text-4xl font-bold text-gradient-warm mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm sm:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ways to Give */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-gradient-warm">Ways to Give</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              There are several ways you can partner with us to equip pastors
              and advance the gospel worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {waysToGive.map((way, i) => (
              <div
                key={way.title}
                className={`glass-card card-warm-hover rounded-2xl p-8 flex flex-col animate-fade-in${
                  i === 0
                    ? ""
                    : i === 1
                    ? "-delay"
                    : "-delay-2"
                }`}
              >
                <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6">
                  {way.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {way.title}
                </h3>
                <p className="text-gray-400 mb-8 flex-grow">
                  {way.description}
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
                >
                  Contact Us
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where Your Gift Goes */}
      <section className="py-20 bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-14 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-gradient-warm">Where Your Gift Goes</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We are committed to stewarding every gift with integrity and
              transparency. Here is how your donation is put to work.
            </p>
          </div>

          <div className="space-y-6 animate-fade-in-delay">
            {allocation.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">{item.label}</span>
                  <span className="text-amber-400 font-bold">
                    {item.percentage}%
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-gradient-warm">Lives Transformed</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Hear from pastors whose ministries have been impacted through your
              generosity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className={`glass-card card-warm-hover rounded-2xl p-8 ${
                  i === 0 ? "animate-slide-in-left" : "animate-slide-in-right"
                }`}
              >
                <svg
                  className="w-10 h-10 text-amber-500/30 mb-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
                </svg>
                <p className="text-gray-300 mb-6 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="text-white font-semibold">{t.name}</p>
                  <p className="text-amber-400/70 text-sm">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 via-amber-500/10 to-amber-700/20" />
            <div className="absolute inset-0 glass-card" />
            <div className="relative z-10 text-center py-16 px-8">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="text-gradient-warm">
                  Every Gift Makes a Difference
                </span>
              </h2>
              <p className="text-gray-300 max-w-xl mx-auto mb-8">
                No matter the size, your contribution helps put life-changing
                books into the hands of pastors and church leaders who need them
                most.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 animate-warm-glow"
                >
                  Contact Us to Give
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
                <Link
                  href="/books"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
                >
                  Explore Our Books
                </Link>
              </div>
              <p className="text-amber-400/60 italic text-sm mt-8">
                &ldquo;He who is faithful in what is least is faithful also in
                much.&rdquo; — Luke 16:10
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
