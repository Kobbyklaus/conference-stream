"use client";

import { useState } from "react";

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
    // Simulate form submission - replace with actual API endpoint
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
          <p className="text-gray-400 mb-8">
            We&apos;ve received your message and will be in touch soon. In the
            meantime, feel free to explore our resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/conferences"
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
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
      <section className="relative py-24 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/30 to-slate-950" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Connect With Us
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Whether you&apos;re a pastor, church leader, or ministry partner —
            we&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm text-gray-400 uppercase tracking-wide mb-1">
                    Email
                  </h3>
                  <p className="text-white">contact@190nations.org</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400 uppercase tracking-wide mb-1">
                    WhatsApp
                  </h3>
                  <p className="text-white">+1 (000) 000-0000</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400 uppercase tracking-wide mb-1">
                    Weekly Conference
                  </h3>
                  <p className="text-white">Every Saturday, 10:00 AM GMT</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400 uppercase tracking-wide mb-1">
                    Social Media
                  </h3>
                  <div className="flex gap-3 mt-2">
                    <a
                      href="https://youtube.com/@daghewardmills"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-gray-300 hover:text-white hover:border-slate-700 transition-colors"
                    >
                      YouTube
                    </a>
                    <a
                      href="https://facebook.com/daghewardmills"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-gray-300 hover:text-white hover:border-slate-700 transition-colors"
                    >
                      Facebook
                    </a>
                    <a
                      href="https://instagram.com/daghewardmills"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-gray-300 hover:text-white hover:border-slate-700 transition-colors"
                    >
                      Instagram
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-10 bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="font-semibold mb-3">What happens next?</h3>
                <ol className="space-y-3 text-sm text-gray-400">
                  <li className="flex gap-3">
                    <span className="text-blue-400 font-bold">1.</span>
                    We receive your message and add you to our network
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-400 font-bold">2.</span>
                    You&apos;ll get the conference link for this Saturday
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-400 font-bold">3.</span>
                    We&apos;ll send you free books and resources
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-400 font-bold">4.</span>
                    Explore partnership opportunities together
                  </li>
                </ol>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-3">
              <form
                onSubmit={handleSubmit}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-5"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Pastor, Rev., Bishop, Church Leader"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">
                    Church / Ministry Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your country"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Tell us about yourself and how we can help..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-lg transition-colors"
                >
                  {loading ? "Sending..." : "Send Message"}
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
