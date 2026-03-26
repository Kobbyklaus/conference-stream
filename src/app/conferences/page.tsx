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
      <section className="relative py-28 sm:py-36 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/bishop-dag-full.jpg" alt="" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/40 via-slate-950/80 to-slate-950" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="animate-fade-in inline-block bg-amber-600/20 border border-amber-500/30 rounded-full px-5 py-2 text-amber-300 text-sm font-medium mb-6 shadow-lg shadow-amber-900/20">
            Every Saturday at 10:00 AM GMT
          </div>
          <h1 className="animate-fade-in-delay text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-gradient-warm">
            Weekly Pastoral Conference
          </h1>
          <p className="animate-fade-in-delay-2 text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join pastors from across the globe for teaching, fellowship, prayer,
            and practical ministry equipping — completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#join"
              className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3.5 rounded-xl text-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-amber-600/25 animate-pulse-glow"
            >
              Join This Saturday
            </a>
            <Link
              href="/room/CONF01"
              className="bg-blue-600/80 hover:bg-blue-500 border border-blue-500/30 text-white px-8 py-3.5 rounded-xl text-lg font-semibold transition-all hover:scale-105"
            >
              Enter Conference Room
            </Link>
          </div>
        </div>
      </section>

      {/* Conference Preview */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 animate-scale-in">
          <img
            src="/images/conference-meeting.svg"
            alt="Weekly pastoral conference with pastors from around the world"
            className="w-full h-auto rounded-2xl border border-amber-500/10 shadow-2xl shadow-amber-900/10"
          />
        </div>
      </section>

      {/* Schedule */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-block bg-amber-600/20 border border-amber-500/30 rounded-full px-4 py-1.5 text-amber-300 text-sm font-medium mb-4">
              Saturday Programme
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gradient-warm">
              Conference Schedule
            </h2>
          </div>
          <div className="space-y-3">
            {schedule.map((s, i) => (
              <div
                key={s.time}
                className={`glass-card card-warm-hover border border-amber-500/10 rounded-xl p-5 flex items-center justify-between ${
                  i === 0 ? "animate-fade-in" : i === 1 ? "animate-fade-in-delay" : "animate-fade-in-delay-2"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="text-amber-400 font-mono font-bold w-24">
                      {s.time}
                    </div>
                    {i < schedule.length - 1 && (
                      <div className="absolute left-3 top-8 w-0.5 h-4 bg-amber-900/30" />
                    )}
                  </div>
                  <div className="text-white font-medium">{s.label}</div>
                </div>
                <div className="text-amber-400/60 text-sm font-medium">{s.duration}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 text-sm mt-6">
            All times in GMT. Conference typically lasts 2 hours.
          </p>
        </div>
      </section>

      {/* Teaching Topics */}
      <section className="py-20 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-block bg-amber-600/20 border border-amber-500/30 rounded-full px-4 py-1.5 text-amber-300 text-sm font-medium mb-4">
              What You Will Learn
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gradient-warm mb-4">
              Teaching Topics
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Our conferences cover practical pastoral topics drawn from Bishop
              Dag Heward-Mills&apos; extensive teaching ministry.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic) => (
              <div
                key={topic}
                className="glass-card card-warm-hover border border-amber-500/10 rounded-xl p-5 flex items-center gap-3"
              >
                <div className="w-2.5 h-2.5 bg-amber-500 rounded-full shrink-0 shadow-sm shadow-amber-500/50" />
                <span className="text-gray-300">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-block bg-amber-600/20 border border-amber-500/30 rounded-full px-4 py-1.5 text-amber-300 text-sm font-medium mb-4">
              Testimonials
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gradient-warm">
              What Pastors Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className={`glass-card rounded-2xl p-8 border border-amber-500/10 relative overflow-hidden ${
                  i === 0 ? "animate-fade-in" : i === 1 ? "animate-fade-in-delay" : "animate-fade-in-delay-2"
                }`}
              >
                <div className="absolute top-4 right-4 text-amber-500/20 text-6xl font-serif leading-none">&ldquo;</div>
                <p className="text-gray-300 mb-6 italic text-lg leading-relaxed relative z-10">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="border-t border-amber-500/10 pt-4">
                  <div className="text-white font-semibold">{t.name}</div>
                  <div className="text-amber-400/70 text-sm">{t.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Join */}
      <section id="join" className="py-20 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-block bg-amber-600/20 border border-amber-500/30 rounded-full px-4 py-1.5 text-amber-300 text-sm font-medium mb-4">
              Get Started
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gradient-warm">
              How to Join
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Register",
                desc: (
                  <>
                    Fill out the{" "}
                    <Link href="/contact" className="text-amber-400 underline underline-offset-2 hover:text-amber-300 transition-colors">
                      contact form
                    </Link>{" "}
                    with your details. We&apos;ll send you the conference link.
                  </>
                ),
              },
              {
                step: "2",
                title: "Join Saturday",
                desc: "Click the conference link at 10:00 AM GMT every Saturday. No software download needed.",
              },
              {
                step: "3",
                title: "Get Resources",
                desc: "After each conference, receive free books, recordings, and ministry materials via email.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center glass-card card-warm-hover rounded-2xl p-8 border border-amber-500/10">
                <div className="w-16 h-16 rounded-full bg-amber-600/20 border-2 border-amber-500/30 flex items-center justify-center text-2xl font-bold text-amber-400 mx-auto mb-5 shadow-lg shadow-amber-900/20">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-3 text-white text-lg">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Country Conferences */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-block bg-amber-600/20 border border-amber-500/30 rounded-full px-4 py-1.5 text-amber-300 text-sm font-medium mb-4">
              Around the World
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gradient-warm">Country Conferences</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { src: "/images/conf-chile.jpeg", alt: "Chile Conference" },
              { src: "/images/conf-dominican.jpeg", alt: "Dominican Republic Conference" },
              { src: "/images/conf-honduras.jpeg", alt: "Honduras Conference" },
              { src: "/images/conf-uruguay.jpeg", alt: "Uruguay Conference" },
            ].map((img) => (
              <div key={img.alt} className="group overflow-hidden rounded-2xl border border-amber-500/10">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-auto transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-amber-950/30 via-slate-900/50 to-blue-950/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gradient-warm">
            Don&apos;t Miss This Saturday
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Register now and join hundreds of pastors from around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3.5 rounded-xl text-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-amber-600/25"
            >
              Register for Free
            </Link>
            <Link
              href="/room/CONF01"
              className="bg-blue-600/80 hover:bg-blue-500 border border-blue-500/30 text-white px-8 py-3.5 rounded-xl text-lg font-semibold transition-all hover:scale-105"
            >
              Enter Conference Room
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
