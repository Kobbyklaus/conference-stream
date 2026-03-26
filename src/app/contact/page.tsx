"use client";

import { useState } from "react";
/* eslint-disable @next/next/no-img-element */

const interests = [
  "Weekly Pastoral Conference",
  "Free Books / Resources",
  "Church Partnership",
  "Host a Conference in My City",
  "Book Distribution in My Country",
  "General Inquiry",
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
          <p className="text-gray-400 mb-3">
            We&apos;ve received your message and will be in touch soon.
          </p>
          <p className="text-amber-400/70 italic text-sm mb-8">
            &ldquo;The harvest is plentiful, but the workers are few.&rdquo; — Matthew 9:37
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/conferences"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold transition-all"
            >
              View Conferences
            </a>
            <a
              href="/books"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Browse Books
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      {/* Hero */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/scripture.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/40 via-slate-950/80 to-slate-950" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center animate-fade-in">
          <div className="inline-block bg-amber-600/20 border border-amber-500/30 rounded-full px-4 py-1.5 text-amber-300 text-sm font-medium mb-6">
            We&apos;d Love to Hear From You
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent">
              Connect With Us
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Whether you&apos;re a pastor, church leader, or ministry partner —
            we&apos;re here to support you.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="md:col-span-2 animate-slide-in-left">
              <h2 className="text-2xl font-bold mb-2">Get in Touch</h2>
              <div className="h-1 w-12 bg-gradient-to-r from-amber-500 to-transparent rounded-full mb-6" />

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-400 uppercase tracking-wide mb-0.5">Email</h3>
                    <p className="text-white">contact@190nations.org</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-400 uppercase tracking-wide mb-0.5">WhatsApp</h3>
                    <p className="text-white">+44 7348 152218</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-400 uppercase tracking-wide mb-0.5">Weekly Conference</h3>
                    <p className="text-white">Every Saturday, 10:00 AM GMT</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-400 uppercase tracking-wide mb-0.5">Social Media</h3>
                    <div className="flex gap-3 mt-2">
                      <a
                        href="https://youtube.com/@daghewardmills"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-2 text-sm text-gray-300 hover:text-amber-300 hover:border-amber-500/30 transition-colors"
                      >
                        YouTube
                      </a>
                      <a
                        href="https://facebook.com/daghewardmills"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-2 text-sm text-gray-300 hover:text-amber-300 hover:border-amber-500/30 transition-colors"
                      >
                        Facebook
                      </a>
                      <a
                        href="https://instagram.com/daghewardmills"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-2 text-sm text-gray-300 hover:text-amber-300 hover:border-amber-500/30 transition-colors"
                      >
                        Instagram
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* What happens next */}
              <div className="mt-10 bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6">
                <h3 className="font-semibold mb-1">What happens next?</h3>
                <div className="h-0.5 w-8 bg-gradient-to-r from-amber-500 to-transparent rounded-full mb-4" />
                <ol className="space-y-3 text-sm text-gray-400">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-xs shrink-0">1</span>
                    We receive your message and add you to our network
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-xs shrink-0">2</span>
                    You&apos;ll get the conference link for this Saturday
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-xs shrink-0">3</span>
                    We&apos;ll send you free books and resources
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-xs shrink-0">4</span>
                    Explore partnership opportunities together
                  </li>
                </ol>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-3 animate-slide-in-right">
              <form
                onSubmit={handleSubmit}
                className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-8 space-y-5"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all placeholder:text-gray-600"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all placeholder:text-gray-600"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">
                    Title / Role
                  </label>
                  <input
                    type="text"
                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all placeholder:text-gray-600"
                    placeholder="e.g., Pastor, Rev., Bishop, Church Leader"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">
                    Church / Ministry Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all placeholder:text-gray-600"
                    placeholder="Your church or ministry"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all placeholder:text-gray-600"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all placeholder:text-gray-600"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">
                      Country *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all placeholder:text-gray-600"
                      placeholder="Your country"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all placeholder:text-gray-600"
                      placeholder="Your city"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">
                    I&apos;m interested in *
                  </label>
                  <select
                    required
                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all [color-scheme:dark]"
                  >
                    <option value="">Select an option...</option>
                    {interests.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all resize-none placeholder:text-gray-600"
                    placeholder="Tell us about yourself and how we can help..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-white py-3.5 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </button>

                <p className="text-gray-500 text-xs text-center">
                  We respect your privacy. Your information will only be used for
                  ministry communication.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
