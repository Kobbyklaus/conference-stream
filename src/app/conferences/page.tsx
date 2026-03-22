import Link from "next/link";
/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Weekly Conferences | 190 Nations Office",
  description: "Join our free weekly online pastoral conference every Saturday. Connect with pastors worldwide.",
};

const schedule = [
  { time: "10:00 AM", label: "Welcome & Opening Prayer", duration: "15 min" },
  { time: "10:15 AM", label: "Worship & Praise", duration: "15 min" },
  { time: "10:30 AM", label: "Main Teaching Session", duration: "45 min" },
  { time: "11:15 AM", label: "Q&A and Discussion", duration: "20 min" },
  { time: "11:35 AM", label: "Prayer & Ministry Time", duration: "15 min" },
  { time: "11:50 AM", label: "Announcements & Closing", duration: "10 min" },
];

const topics = [
  "The Art of Pastoral Leadership",
  "Church Planting Strategies for 2026",
  "Building Loyalty in Ministry",
  "Catching and Operating in the Anointing",
  "Shepherding Large Congregations",
  "Evangelism and Outreach Methods",
  "Managing Church Finances with Integrity",
  "Developing Leaders Within Your Church",
  "Understanding Church Growth Dynamics",
  "Dealing with Ministry Challenges",
  "The Power of Prayer in Leadership",
  "Missions and Global Outreach",
];

const testimonials = [
  {
    quote: "These conferences have transformed my pastoral ministry. The practical teachings are exactly what I needed.",
    name: "Pastor James O.",
    location: "Lagos, Nigeria",
  },
  {
    quote: "I look forward to every Saturday. The fellowship with pastors from different nations is incredible.",
    name: "Pastora Maria L.",
    location: "Santiago, Chile",
  },
  {
    quote: "The free books and resources have equipped our entire leadership team. We are so grateful.",
    name: "Rev. David K.",
    location: "Nairobi, Kenya",
  },
];

export default function Conferences() {
  return (
    <main>
      {/* Hero */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/bishop-dag-full.jpg" alt="" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/70 via-slate-950/80 to-slate-950" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block bg-green-600/20 border border-green-500/30 rounded-full px-4 py-1.5 text-green-300 text-sm font-medium mb-6">
            Every Saturday at 10:00 AM GMT
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Weekly Pastoral Conference
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join pastors from across the globe for teaching, fellowship, prayer,
            and practical ministry equipping — completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#join"
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl text-lg font-semibold transition-all hover:scale-105 animate-pulse-glow"
            >
              Join This Saturday
            </a>
            <Link
              href="/room/CONF01"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3.5 rounded-xl text-lg font-semibold transition-all hover:scale-105"
            >
              Enter Conference Room
            </Link>
          </div>
        </div>
      </section>

      {/* Conference Preview */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <img src="/images/conference-meeting.svg" alt="Weekly pastoral conference with pastors from around the world" className="w-full h-auto rounded-2xl border border-slate-800" />
        </div>
      </section>

      {/* Schedule */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Conference Schedule
          </h2>
          <div className="space-y-3">
            {schedule.map((s) => (
              <div
                key={s.time}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="text-blue-400 font-mono font-bold w-24">
                    {s.time}
                  </div>
                  <div className="text-white font-medium">{s.label}</div>
                </div>
                <div className="text-gray-500 text-sm">{s.duration}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">
            All times in GMT. Conference typically lasts 2 hours.
          </p>
        </div>
      </section>

      {/* Upcoming Topics */}
      <section className="py-20 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Teaching Topics
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Our conferences cover practical pastoral topics drawn from Bishop
            Dag Heward-Mills&apos; extensive teaching ministry.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic) => (
              <div
                key={topic}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3 hover:border-blue-500/50 transition-colors"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                <span className="text-gray-300">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Pastors Say
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
              >
                <p className="text-gray-300 mb-4 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <div className="text-white font-semibold">{t.name}</div>
                  <div className="text-gray-500 text-sm">{t.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Join */}
      <section id="join" className="py-20 bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How to Join
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Register</h3>
              <p className="text-gray-400 text-sm">
                Fill out the{" "}
                <Link href="/contact" className="text-blue-400 underline">
                  contact form
                </Link>{" "}
                with your details. We&apos;ll send you the conference link.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Join Saturday</h3>
              <p className="text-gray-400 text-sm">
                Click the conference link at 10:00 AM GMT every Saturday. No
                software download needed.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Get Resources</h3>
              <p className="text-gray-400 text-sm">
                After each conference, receive free books, recordings, and
                ministry materials via email.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Past Conferences */}
      <section className="py-20 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Country Conferences</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <img src="/images/conf-chile.jpeg" alt="Chile Conference" className="rounded-xl border border-slate-800 hover:border-blue-500/50 transition-all hover:-translate-y-1" />
            <img src="/images/conf-dominican.jpeg" alt="Dominican Republic Conference" className="rounded-xl border border-slate-800 hover:border-blue-500/50 transition-all hover:-translate-y-1" />
            <img src="/images/conf-honduras.jpeg" alt="Honduras Conference" className="rounded-xl border border-slate-800 hover:border-blue-500/50 transition-all hover:-translate-y-1" />
            <img src="/images/conf-uruguay.jpeg" alt="Uruguay Conference" className="rounded-xl border border-slate-800 hover:border-blue-500/50 transition-all hover:-translate-y-1" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Don&apos;t Miss This Saturday
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Register now and join hundreds of pastors from around the world.
          </p>
          <Link
            href="/contact"
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl text-lg font-semibold transition-all hover:scale-105"
          >
            Register for Free
          </Link>
        </div>
      </section>
    </main>
  );
}
