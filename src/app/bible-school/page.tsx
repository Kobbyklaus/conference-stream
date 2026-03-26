import Link from "next/link";
/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anagkazo Bible & Ministry Training Centre | 190 Nations Office",
  description:
    "Anagkazo Bible & Ministry Training Centre — training and equipping men and women for the work of the ministry. Founded by Bishop Dag Heward-Mills.",
};

const programs = [
  {
    title: "Junior Clerkship",
    duration: "18 Months",
    certificate: "General Certificate in Ministry",
    description:
      "Covers the pillars of ministry including sacrifice, church growth, financial management, shepherding, leadership, and loyalty.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    title: "Senior Clerkship",
    duration: "18 Months",
    certificate: "Diploma in Ministry + Pastoral Appointment",
    description:
      "Full scope of theoretical and practical training with deeper textbook study and personal interaction with The Chancellor.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
  },
  {
    title: "Executive Online Courses",
    duration: "Quarterly",
    certificate: "Course Completion Certificate",
    description:
      "In-depth online courses on specific ministerial topics delivered via Zoom and digital platforms for working ministers.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
      </svg>
    ),
  },
];

const curriculum = [
  "Sacrifice & the Call",
  "Church Growth",
  "Loyalty & Leadership",
  "Shepherding",
  "Financial Management",
  "The Art of Ministry",
  "Evangelism & Soul Winning",
  "Church Planting",
  "Prayer & the Anointing",
  "Church History",
  "Power of the Holy Spirit",
  "The Art of Hearing",
];

const practicalTraining = [
  {
    title: "Church Planting",
    description: "Students plant churches in neighboring towns as hands-on ministry training.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    title: "Camp Meetings & Crusades",
    description: "Participate in large-scale evangelistic events and pastoral conferences.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    title: "Character Development",
    description: "Non-academic rotations in hospitality, construction, and community service build well-rounded ministers.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
  },
  {
    title: "Cell Groups & Outreach",
    description: "Lead cell groups and community outreaches to develop shepherding and evangelism skills.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
];

const stats = [
  { value: "800+", label: "Full-Time Students" },
  { value: "40+", label: "Nations Represented" },
  { value: "26", label: "Academic Rotations" },
  { value: "3 Years", label: "Full Program" },
];

export default function BibleSchoolPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/bishop-dag-preaching.jpg"
            alt="Anagkazo Bible School"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-amber-900/40 via-slate-950/70 to-slate-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-transparent" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto animate-fade-in">
          <p className="text-amber-300/80 italic text-sm sm:text-base mb-4">
            &ldquo;Go out into the highways and hedges, and compel them to come in...&rdquo; — Luke 14:23
          </p>
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-6 py-2 mb-8">
            <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <span className="text-amber-200 font-medium text-sm sm:text-base">
              Anagkazo — &ldquo;Compelling Power&rdquo;
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-6 text-gradient-warm leading-tight">
            Anagkazo Bible &<br />Ministry Training Centre
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto mb-4 leading-relaxed">
            Training and equipping men and women for the work of the ministry.
          </p>
          <p className="text-base text-gray-400 max-w-2xl mx-auto mb-10">
            Founded by Bishop Dag Heward-Mills — raising anointed ministers
            who will compel the unsaved to enter the Kingdom of God.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://admissions.anagkazobibleministrytrainingcentre.org/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-4 rounded-xl font-bold text-lg transition-all animate-warm-glow"
            >
              Apply Now
            </a>
            <a
              href="#programs"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
            >
              View Programs
            </a>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-amber-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="glass-card rounded-2xl p-6 text-center animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-3xl sm:text-4xl font-black text-gradient-warm mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-gradient-warm mb-6">
              The Vision
            </h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Anagkazo is committed to raising ministers who will take the Gospel to every corner of the earth.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { target: "100,000", label: "People Trained" },
              { target: "10,000", label: "Pastors Appointed" },
              { target: "10,000", label: "Ministers Ordained" },
              { target: "1,000", label: "Bishops Consecrated" },
            ].map((goal, i) => (
              <div
                key={goal.label}
                className="glass-card card-warm-hover rounded-2xl p-6 text-center animate-fade-in"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="text-2xl sm:text-3xl font-black text-amber-400 mb-2">
                  {goal.target}
                </div>
                <div className="text-gray-400 text-sm">{goal.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="py-20 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-gradient-blue mb-6">
              Programs
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              From full-time residential training to flexible online courses — find the right path for your calling.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((program, i) => (
              <div
                key={program.title}
                className="glass-card card-warm-hover rounded-2xl p-8 animate-fade-in"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
                  {program.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {program.title}
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-amber-400 text-sm font-semibold bg-amber-500/10 px-3 py-1 rounded-full">
                    {program.duration}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {program.description}
                </p>
                <div className="pt-4 border-t border-slate-800">
                  <p className="text-xs text-gray-500">Certificate:</p>
                  <p className="text-sm text-amber-300 font-medium">
                    {program.certificate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-gradient-warm mb-6">
                What You&apos;ll Learn
              </h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                The curriculum covers 26 academic rotations spanning the full
                scope of ministry — from theology and church growth to
                practical leadership and the anointing of the Holy Spirit.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {curriculum.map((topic, i) => (
                  <div
                    key={topic}
                    className="flex items-center gap-3 glass-card rounded-xl px-4 py-3 animate-fade-in"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    <span className="text-gray-200 text-sm font-medium">
                      {topic}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="/images/bishop-dag-stage.jpg"
                alt="Anagkazo training"
                className="rounded-2xl shadow-2xl shadow-amber-500/10 w-full"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-950/50 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Practical Training */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-gradient-blue mb-6">
              Hands-On Ministry Training
            </h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              What sets Anagkazo apart — students don&apos;t just study ministry,
              they practice it from day one.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {practicalTraining.map((item, i) => (
              <div
                key={item.title}
                className="glass-card card-warm-hover rounded-2xl p-6 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admission Info */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-gradient-warm mb-6">
              How to Join
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Admissions open three times a year — February, June, and October.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Apply Online",
                description:
                  "Fill out the registration form with your personal details, qualifications, and ministry experience.",
              },
              {
                step: "2",
                title: "Interview",
                description:
                  "Complete an admissions interview to assess your readiness and calling for full-time ministry training.",
              },
              {
                step: "3",
                title: "Begin Training",
                description:
                  "Join the community at the main campus in Ghana and begin your 3-year journey of transformation.",
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <div className="w-16 h-16 rounded-full border-2 border-amber-500 flex items-center justify-center text-amber-400 text-2xl font-black mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <div className="glass-card rounded-2xl p-8 max-w-lg mx-auto">
              <p className="text-gray-400 text-sm mb-2">Main Campus</p>
              <p className="text-white font-bold text-lg mb-1">
                Akwapim-Mampong, Ghana
              </p>
              <p className="text-gray-500 text-sm mb-4">
                Approximately 45 minutes from Accra
              </p>
              <div className="flex flex-col gap-2 text-sm">
                <a
                  href="mailto:abmtc.admissions@gmail.com"
                  className="text-amber-400 hover:text-amber-300 transition-colors"
                >
                  abmtc.admissions@gmail.com
                </a>
                <span className="text-gray-400">+233 (0) 557 467 460</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-gradient-blue mb-6">
              Transformed Lives
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Anagkazo goes beyond academic education — it actually trains you to become an effective minister of the Gospel. My life and ministry were completely transformed.",
                name: "Graduate",
                location: "Switzerland",
              },
              {
                quote:
                  "The practical church planting experience changed everything for me. I didn't just learn about ministry — I lived it every single day for three years.",
                name: "Graduate",
                location: "Nigeria",
              },
              {
                quote:
                  "The character development, the sacrifice, the community — Anagkazo prepared me for the real challenges of pastoral ministry in ways no other school could.",
                name: "Graduate",
                location: "Kenya",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="glass-card card-warm-hover rounded-2xl p-8 animate-fade-in"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <svg
                  className="w-8 h-8 text-amber-500/30 mb-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">
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
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/40 via-slate-950 to-blue-900/30" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-black text-gradient-warm mb-6">
            Answer the Call
          </h2>
          <p className="text-gray-300 text-lg mb-4 max-w-2xl mx-auto">
            Join hundreds of students from over 40 nations training to take the
            Gospel to the ends of the earth.
          </p>
          <p className="text-amber-300/70 italic text-sm mb-10">
            &ldquo;And the things that thou hast heard of me among many witnesses,
            the same commit thou to faithful men, who shall be able to teach
            others also.&rdquo; — 2 Timothy 2:2
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://admissions.anagkazobibleministrytrainingcentre.org/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-4 rounded-xl font-bold text-lg transition-all animate-warm-glow"
            >
              Apply to Anagkazo
            </a>
            <a
              href="https://abmtc.org/en"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
            >
              Visit Official Website
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
