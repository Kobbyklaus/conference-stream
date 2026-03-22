"use client";

import { useState, useEffect, useMemo } from "react";

interface Pastor {
  pastor_id: string;
  title?: string;
  pastor_name?: string;
  church_name?: string;
  denomination?: string;
  continent?: string;
  country?: string;
  city?: string;
  email?: string;
  phone?: string;
  website?: string;
  lang?: string;
  tz?: string;
  greeting?: string;
  campaign_stage?: string;
}

interface CountrySummary {
  country: string;
  total: number;
  has_email: number;
  lang: string;
  tz: string;
  continent: string;
}

const STAGES = [
  { key: "new", label: "New", color: "bg-gray-500" },
  { key: "meeting_invited", label: "Meeting Invited", color: "bg-blue-500" },
  { key: "meeting_done", label: "Meeting Done", color: "bg-green-500" },
  { key: "conference_invited", label: "Conference Invited", color: "bg-purple-500" },
  { key: "active", label: "Active Partner", color: "bg-emerald-500" },
];

const MEETING_TEMPLATES: Record<string, { subject: string; body: string }> = {
  en: {
    subject: "190 Nations Office — Personal Meeting Invitation",
    body: `{{greeting}} {{title}} {{name}},

My name is Walter from the 190 Nations Office, the global outreach arm of Bishop Dag Heward-Mills' ministry.

We are reaching out to pastors and church leaders in {{country}} because we believe in the power of connecting God's servants across nations. We would love to schedule a brief personal meeting with you to:

• Introduce the 190 Nations Office and our mission
• Share about our free pastoral resources and books
• Learn about your ministry and how we can support you
• Discuss upcoming opportunities for partnership

Would you be available for a 20-minute online meeting this week or next? We are flexible with timing and can work around your schedule.

You can reply to this email with your preferred date/time, or simply let us know and we will send you a calendar invite.

We look forward to connecting with you!

Warm regards,
Walter
190 Nations Office
Ministry of Dag Heward-Mills`,
  },
  es: {
    subject: "190 Nations Office — Invitación a Reunión Personal",
    body: `{{greeting}} {{title}} {{name}},

Mi nombre es Walter de la Oficina 190 Naciones, el brazo de alcance global del ministerio del Obispo Dag Heward-Mills.

Nos estamos comunicando con pastores y líderes de iglesias en {{country}} porque creemos en el poder de conectar a los siervos de Dios entre las naciones. Nos encantaría programar una breve reunión personal con usted para:

• Presentar la Oficina 190 Naciones y nuestra misión
• Compartir sobre nuestros recursos pastorales y libros gratuitos
• Conocer su ministerio y cómo podemos apoyarle
• Discutir oportunidades de colaboración

¿Estaría disponible para una reunión en línea de 20 minutos esta semana o la próxima? Somos flexibles con los horarios.

Puede responder a este correo con su fecha/hora preferida, o simplemente háganoslo saber y le enviaremos una invitación de calendario.

¡Esperamos conectar con usted!

Cordialmente,
Walter
Oficina 190 Naciones
Ministerio de Dag Heward-Mills`,
  },
  pt: {
    subject: "190 Nations Office — Convite para Reunião Pessoal",
    body: `{{greeting}} {{title}} {{name}},

Meu nome é Walter do Escritório 190 Nações, o braço de alcance global do ministério do Bispo Dag Heward-Mills.

Estamos entrando em contato com pastores e líderes de igrejas em {{country}} porque acreditamos no poder de conectar os servos de Deus entre as nações. Gostaríamos de agendar uma breve reunião pessoal com você para:

• Apresentar o Escritório 190 Nações e nossa missão
• Compartilhar sobre nossos recursos pastorais e livros gratuitos
• Conhecer seu ministério e como podemos apoiá-lo
• Discutir oportunidades de parceria

Você estaria disponível para uma reunião online de 20 minutos esta semana ou na próxima? Somos flexíveis com os horários.

Você pode responder a este e-mail com sua data/horário preferido, ou simplesmente nos avise e enviaremos um convite de calendário.

Aguardamos ansiosamente o contato com você!

Atenciosamente,
Walter
Escritório 190 Nações
Ministério de Dag Heward-Mills`,
  },
  fr: {
    subject: "190 Nations Office — Invitation à une Réunion Personnelle",
    body: `{{greeting}} {{title}} {{name}},

Je m'appelle Walter du Bureau 190 Nations, le bras de sensibilisation mondial du ministère de l'Évêque Dag Heward-Mills.

Nous contactons les pasteurs et les responsables d'églises en {{country}} car nous croyons au pouvoir de connecter les serviteurs de Dieu à travers les nations. Nous aimerions planifier une brève réunion personnelle avec vous pour:

• Présenter le Bureau 190 Nations et notre mission
• Partager nos ressources pastorales et livres gratuits
• En savoir plus sur votre ministère et comment nous pouvons vous soutenir
• Discuter des opportunités de partenariat

Seriez-vous disponible pour une réunion en ligne de 20 minutes cette semaine ou la semaine prochaine? Nous sommes flexibles avec les horaires.

Vous pouvez répondre à cet e-mail avec votre date/heure préférée, ou faites-le nous savoir et nous vous enverrons une invitation.

Au plaisir de vous rencontrer!

Cordialement,
Walter
Bureau 190 Nations
Ministère de Dag Heward-Mills`,
  },
};

const CONFERENCE_TEMPLATES: Record<string, { subject: string; body: string }> = {
  en: {
    subject: "You're Invited — Weekly Pastoral Conference (Every Saturday)",
    body: `{{greeting}} {{title}} {{name}},

Following our connection, I'm excited to invite you to our Weekly Pastoral Conference!

📅 Every Saturday at 10:00 AM GMT
🌍 Pastors from {{country}} and 98 other countries attend
📚 Free books and resources after every session
💻 Online — no travel needed

What to expect:
• 10:00 AM — Welcome & Opening Prayer (15 min)
• 10:15 AM — Worship & Praise (15 min)
• 10:30 AM — Main Teaching Session (45 min)
• 11:15 AM — Q&A and Discussion (20 min)
• 11:35 AM — Prayer & Ministry Time (15 min)

Topics include: The Art of Leadership, Church Planting, Catching the Anointing, Building Loyalty in Ministry, and more.

This Saturday's conference link: [Conference Link]

We would love to see you there!

Warm regards,
Walter
190 Nations Office
Ministry of Dag Heward-Mills`,
  },
  es: {
    subject: "Está Invitado — Conferencia Pastoral Semanal (Cada Sábado)",
    body: `{{greeting}} {{title}} {{name}},

Después de nuestra conexión, me complace invitarle a nuestra Conferencia Pastoral Semanal.

📅 Cada sábado a las 10:00 AM GMT
🌍 Pastores de {{country}} y 98 otros países participan
📚 Libros y recursos gratuitos después de cada sesión
💻 En línea — no necesita viajar

Qué esperar:
• 10:00 AM — Bienvenida y Oración de Apertura (15 min)
• 10:15 AM — Alabanza y Adoración (15 min)
• 10:30 AM — Sesión de Enseñanza Principal (45 min)
• 11:15 AM — Preguntas y Discusión (20 min)
• 11:35 AM — Tiempo de Oración y Ministración (15 min)

Temas incluyen: El Arte del Liderazgo, Plantación de Iglesias, Atrapar la Unción, Lealtad en el Ministerio, y más.

Enlace de la conferencia de este sábado: [Enlace de Conferencia]

¡Nos encantaría verle allí!

Cordialmente,
Walter
Oficina 190 Naciones
Ministerio de Dag Heward-Mills`,
  },
  pt: {
    subject: "Você Está Convidado — Conferência Pastoral Semanal (Todo Sábado)",
    body: `{{greeting}} {{title}} {{name}},

Após nossa conexão, tenho o prazer de convidá-lo para nossa Conferência Pastoral Semanal!

📅 Todo sábado às 10:00 AM GMT
🌍 Pastores de {{country}} e 98 outros países participam
📚 Livros e recursos gratuitos após cada sessão
💻 Online — sem necessidade de viagem

O que esperar:
• 10:00 AM — Boas-vindas e Oração de Abertura (15 min)
• 10:15 AM — Louvor e Adoração (15 min)
• 10:30 AM — Sessão de Ensino Principal (45 min)
• 11:15 AM — Perguntas e Discussão (20 min)
• 11:35 AM — Tempo de Oração e Ministração (15 min)

Temas incluem: A Arte da Liderança, Plantação de Igrejas, Capturando a Unção, Lealdade no Ministério, e mais.

Link da conferência deste sábado: [Link da Conferência]

Adoraríamos vê-lo lá!

Atenciosamente,
Walter
Escritório 190 Nações
Ministério de Dag Heward-Mills`,
  },
  fr: {
    subject: "Vous Êtes Invité — Conférence Pastorale Hebdomadaire (Chaque Samedi)",
    body: `{{greeting}} {{title}} {{name}},

Suite à notre connexion, j'ai le plaisir de vous inviter à notre Conférence Pastorale Hebdomadaire!

📅 Chaque samedi à 10h00 GMT
🌍 Des pasteurs de {{country}} et 98 autres pays participent
📚 Livres et ressources gratuits après chaque session
💻 En ligne — pas de déplacement nécessaire

Programme:
• 10h00 — Accueil et Prière d'Ouverture (15 min)
• 10h15 — Louange et Adoration (15 min)
• 10h30 — Session d'Enseignement Principal (45 min)
• 11h15 — Questions et Discussion (20 min)
• 11h35 — Temps de Prière et Ministère (15 min)

Sujets: L'Art du Leadership, Plantation d'Églises, Saisir l'Onction, Fidélité dans le Ministère, et plus.

Lien de la conférence de ce samedi: [Lien de Conférence]

Nous serions ravis de vous y voir!

Cordialement,
Walter
Bureau 190 Nations
Ministère de Dag Heward-Mills`,
  },
};

function fillTemplate(
  template: string,
  pastor: Pastor
): string {
  return template
    .replace(/\{\{greeting\}\}/g, pastor.greeting || "Dear")
    .replace(/\{\{title\}\}/g, pastor.title || "Pastor")
    .replace(/\{\{name\}\}/g, pastor.pastor_name || "")
    .replace(/\{\{country\}\}/g, pastor.country || "")
    .replace(/\{\{church\}\}/g, pastor.church_name || "")
    .replace(/\{\{city\}\}/g, pastor.city || "");
}

export default function Outreach() {
  const [pastors, setPastors] = useState<Pastor[]>([]);
  const [countries, setCountries] = useState<CountrySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedContinent, setSelectedContinent] = useState("");
  const [campaignType, setCampaignType] = useState<"meeting" | "conference">("meeting");
  const [sending, setSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const [previewPastor, setPreviewPastor] = useState<Pastor | null>(null);
  const [sentEmails, setSentEmails] = useState<Set<string>>(new Set());
  const [senderEmail, setSenderEmail] = useState("");
  const [senderPassword, setSenderPassword] = useState("");
  const [showConfig, setShowConfig] = useState(false);
  const [batchSize, setBatchSize] = useState(10);
  const [delaySeconds, setDelaySeconds] = useState(30);

  useEffect(() => {
    Promise.all([
      fetch("/data/pastors.json").then((r) => r.json()),
      fetch("/data/countries.json").then((r) => r.json()),
    ]).then(([p, c]) => {
      setPastors(p);
      setCountries(c);
      setLoading(false);
    });
  }, []);

  const continents = useMemo(
    () => [...new Set(countries.map((c) => c.continent).filter(Boolean))].sort(),
    [countries]
  );

  const filteredCountries = useMemo(() => {
    if (!selectedContinent) return countries;
    return countries.filter((c) => c.continent === selectedContinent);
  }, [countries, selectedContinent]);

  const countryPastors = useMemo(() => {
    if (!selectedCountry) return [];
    return pastors.filter(
      (p) => p.country === selectedCountry && p.email
    );
  }, [pastors, selectedCountry]);

  const eligibleForCampaign = useMemo(() => {
    return countryPastors.filter((p) => !sentEmails.has(p.pastor_id));
  }, [countryPastors, sentEmails]);

  const selectedCountryMeta = useMemo(() => {
    return countries.find((c) => c.country === selectedCountry);
  }, [countries, selectedCountry]);

  const template = useMemo(() => {
    const lang = selectedCountryMeta?.lang || "en";
    const templates = campaignType === "meeting" ? MEETING_TEMPLATES : CONFERENCE_TEMPLATES;
    return templates[lang] || templates["en"];
  }, [selectedCountryMeta, campaignType]);

  async function handleSendCampaign() {
    if (!senderEmail || !senderPassword) {
      setShowConfig(true);
      return;
    }
    if (eligibleForCampaign.length === 0) return;

    setSending(true);
    setSentCount(0);
    const batch = eligibleForCampaign.slice(0, batchSize);

    for (let i = 0; i < batch.length; i++) {
      const p = batch[i];
      const subject = fillTemplate(template.subject, p);
      const body = fillTemplate(template.body, p);

      try {
        const res = await fetch("/api/outreach/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: p.email,
            subject,
            body,
            senderEmail,
            senderPassword,
          }),
        });

        if (res.ok) {
          setSentEmails((prev) => new Set([...prev, p.pastor_id]));
          setSentCount((c) => c + 1);
        }
      } catch {
        // continue with next
      }

      // Delay between emails
      if (i < batch.length - 1 && delaySeconds > 0) {
        await new Promise((r) => setTimeout(r, delaySeconds * 1000));
      }
    }

    setSending(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main>
      {/* Hero */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-950/30 to-slate-950" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Outreach Campaigns
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Send country-specific meeting invitations and conference invites to
            pastors. Messages are sent in their local language.
          </p>
        </div>
      </section>

      {/* Campaign Flow */}
      <section className="py-6 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
            {STAGES.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <span
                  className={`${s.color} text-white px-3 py-1 rounded-full text-xs font-medium`}
                >
                  {s.label}
                </span>
                {i < STAGES.length - 1 && (
                  <span className="text-gray-600">&rarr;</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Country Selection */}
            <div className="lg:col-span-1">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-20">
                <h2 className="text-lg font-bold mb-4">Select Country</h2>

                <select
                  value={selectedContinent}
                  onChange={(e) => {
                    setSelectedContinent(e.target.value);
                    setSelectedCountry("");
                  }}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm mb-3"
                >
                  <option value="">All Continents</option>
                  {continents.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <div className="space-y-1 max-h-96 overflow-y-auto">
                  {filteredCountries.map((c) => (
                    <button
                      key={c.country}
                      onClick={() => setSelectedCountry(c.country)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between items-center ${
                        selectedCountry === c.country
                          ? "bg-blue-600 text-white"
                          : "hover:bg-slate-800 text-gray-300"
                      }`}
                    >
                      <span>{c.country}</span>
                      <span className="flex gap-2">
                        <span
                          className={`text-xs ${
                            selectedCountry === c.country
                              ? "text-blue-200"
                              : "text-gray-500"
                          }`}
                        >
                          {c.has_email} emails
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Campaign Panel */}
            <div className="lg:col-span-2">
              {!selectedCountry ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                  <div className="text-5xl mb-4">🌍</div>
                  <h3 className="text-xl font-bold mb-2">
                    Select a Country to Start
                  </h3>
                  <p className="text-gray-400">
                    Choose a country from the left panel to view available
                    contacts and launch a campaign.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Country Header */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div>
                        <h2 className="text-2xl font-bold">
                          {selectedCountry}
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">
                          {selectedCountryMeta?.continent} &middot; Language:{" "}
                          {selectedCountryMeta?.lang?.toUpperCase()} &middot;
                          Timezone: {selectedCountryMeta?.tz}
                        </p>
                      </div>
                      <div className="flex gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-400">
                            {countryPastors.length}
                          </div>
                          <div className="text-xs text-gray-500">
                            With Email
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-400">
                            {sentEmails.size}
                          </div>
                          <div className="text-xs text-gray-500">Sent</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-orange-400">
                            {eligibleForCampaign.length}
                          </div>
                          <div className="text-xs text-gray-500">
                            Remaining
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Campaign Type */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="font-bold mb-3">Campaign Type</h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setCampaignType("meeting")}
                        className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                          campaignType === "meeting"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-800 text-gray-400 hover:bg-slate-700"
                        }`}
                      >
                        Step 1: Meeting Invite
                      </button>
                      <button
                        onClick={() => setCampaignType("conference")}
                        className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                          campaignType === "conference"
                            ? "bg-purple-600 text-white"
                            : "bg-slate-800 text-gray-400 hover:bg-slate-700"
                        }`}
                      >
                        Step 2: Conference Invite
                      </button>
                    </div>
                  </div>

                  {/* Email Preview */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold">
                        Message Preview ({selectedCountryMeta?.lang?.toUpperCase()})
                      </h3>
                      {countryPastors.length > 0 && (
                        <button
                          onClick={() =>
                            setPreviewPastor(
                              previewPastor ? null : countryPastors[0]
                            )
                          }
                          className="text-xs text-blue-400 hover:text-blue-300"
                        >
                          {previewPastor
                            ? "Show Template"
                            : "Preview with Real Data"}
                        </button>
                      )}
                    </div>
                    <div className="bg-slate-950 rounded-lg p-4 text-sm">
                      <div className="text-blue-400 mb-2">
                        <strong>Subject:</strong>{" "}
                        {previewPastor
                          ? fillTemplate(template.subject, previewPastor)
                          : template.subject}
                      </div>
                      <pre className="text-gray-300 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {previewPastor
                          ? fillTemplate(template.body, previewPastor)
                          : template.body}
                      </pre>
                    </div>
                  </div>

                  {/* Send Config */}
                  {showConfig && (
                    <div className="bg-slate-900 border border-orange-500/30 rounded-2xl p-6">
                      <h3 className="font-bold mb-3 text-orange-400">
                        Email Configuration
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        Enter your Gmail credentials. Use an App Password (not
                        your regular password). Go to Google Account &rarr;
                        Security &rarr; App Passwords to generate one.
                      </p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <input
                          type="email"
                          value={senderEmail}
                          onChange={(e) => setSenderEmail(e.target.value)}
                          placeholder="your-email@gmail.com"
                          className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm"
                        />
                        <input
                          type="password"
                          value={senderPassword}
                          onChange={(e) => setSenderPassword(e.target.value)}
                          placeholder="App Password"
                          className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm"
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3 mt-3">
                        <div>
                          <label className="text-xs text-gray-500">
                            Batch Size
                          </label>
                          <input
                            type="number"
                            value={batchSize}
                            onChange={(e) =>
                              setBatchSize(Number(e.target.value))
                            }
                            min={1}
                            max={50}
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">
                            Delay Between Emails (seconds)
                          </label>
                          <input
                            type="number"
                            value={delaySeconds}
                            onChange={(e) =>
                              setDelaySeconds(Number(e.target.value))
                            }
                            min={5}
                            max={120}
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Send Button */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                      <div>
                        <p className="text-white font-medium">
                          Ready to send{" "}
                          <span className="text-blue-400">
                            {Math.min(batchSize, eligibleForCampaign.length)}
                          </span>{" "}
                          {campaignType === "meeting"
                            ? "meeting invitations"
                            : "conference invitations"}{" "}
                          to pastors in {selectedCountry}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Messages will be sent in{" "}
                          {selectedCountryMeta?.lang === "es"
                            ? "Spanish"
                            : selectedCountryMeta?.lang === "pt"
                            ? "Portuguese"
                            : selectedCountryMeta?.lang === "fr"
                            ? "French"
                            : "English"}
                          {" "}with {delaySeconds}s delay between each
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowConfig(!showConfig)}
                          className="bg-slate-800 text-gray-300 px-4 py-2.5 rounded-xl text-sm hover:bg-slate-700 transition-colors"
                        >
                          {showConfig ? "Hide Config" : "Configure"}
                        </button>
                        <button
                          onClick={handleSendCampaign}
                          disabled={
                            sending || eligibleForCampaign.length === 0
                          }
                          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            campaignType === "meeting"
                              ? "bg-blue-600 hover:bg-blue-500"
                              : "bg-purple-600 hover:bg-purple-500"
                          } text-white disabled:opacity-30`}
                        >
                          {sending
                            ? `Sending... (${sentCount}/${Math.min(batchSize, eligibleForCampaign.length)})`
                            : `Send ${campaignType === "meeting" ? "Meeting" : "Conference"} Invites`}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Contact List */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="font-bold mb-4">
                      Contacts in {selectedCountry} ({countryPastors.length})
                    </h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {countryPastors.map((p) => (
                        <div
                          key={p.pastor_id}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                            sentEmails.has(p.pastor_id)
                              ? "bg-green-950/30 border border-green-800/30"
                              : "bg-slate-800/50"
                          }`}
                        >
                          <div>
                            <span className="text-white">
                              {p.title ? `${p.title} ` : ""}
                              {p.pastor_name || p.church_name}
                            </span>
                            {p.city && (
                              <span className="text-gray-500 ml-2">
                                {p.city}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500 text-xs truncate max-w-40">
                              {p.email}
                            </span>
                            {sentEmails.has(p.pastor_id) ? (
                              <span className="text-green-400 text-xs">
                                Sent ✓
                              </span>
                            ) : (
                              <span className="text-gray-600 text-xs">
                                Pending
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                      {countryPastors.length === 0 && (
                        <p className="text-gray-500 text-sm text-center py-4">
                          No contacts with email addresses in this country.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
