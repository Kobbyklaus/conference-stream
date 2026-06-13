"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Locale = "en" | "es" | "fr" | "pt" | "ar";

export const LOCALES: { code: Locale; label: string; flag: string; rtl?: boolean }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "ar", label: "العربية", flag: "🇸🇦", rtl: true },
];

type Dict = Record<string, string>;

const en: Dict = {
  joinSubtitle: "Enter your details to join the conference",
  yourName: "Your Name",
  namePlaceholder: "Enter your display name",
  email: "Email",
  country: "Country",
  selectCountry: "Select your country",
  prayerRequest: "Prayer Request",
  optional: "(optional)",
  prayerPlaceholder: "Share a prayer request (optional)...",
  joinConference: "Join Conference",
  startsIn: "Starts in {time}",
  sessionExpiredPre: "Your admin session expired. To host this conference, ",
  signInAgain: "sign in again",
  startingSoon: "Starting Soon",
  startingNow: "Starting now…",
  hours: "Hours",
  minutes: "Minutes",
  seconds: "Seconds",
  scheduledFor: "Scheduled for",
  waitingOne: "{n} person waiting",
  waitingMany: "{n} people waiting",
  shareConference: "Share this conference",
  copyLink: "Copy Link",
  copied: "Copied!",
  startNow: "Start Now",
  give: "Give",
  share: "Share",
  preview: "Preview",
  participants: "Participants",
  previewingBanner: "Previewing as an attendee — this is exactly what they see.",
  exitPreview: "Exit preview",
  loading: "Loading conference...",
  error: "Error",
  roomNotFound: "Room not found. Check the code and try again.",
  conferenceEnded: "Conference Ended",
  hasEnded: "{name} has ended.",
  removed: "Removed",
  removedMsg: "You have been removed from this conference.",
  backHome: "Back to Home",
  liveChat: "Live Chat",
  chat: "Chat",
  prayerRequests: "Prayer Requests",
  noMessages: "No messages yet. Be the first to comment!",
  typeMessage: "Type a message...",
  send: "Send",
  noPrayers: "No prayer requests yet.",
  giveOffering: "Give an Offering",
  support: "Support {name}",
  giveWithPaypal: "Give with PayPal",
  cardOrPaypal: "Card or PayPal balance",
  regionalMethod: "Regional payment method",
  close: "Close",
  tapToUnmute: "Tap to Unmute",
  language: "Language",
};

const es: Dict = {
  joinSubtitle: "Introduce tus datos para unirte a la conferencia",
  yourName: "Tu nombre",
  namePlaceholder: "Escribe tu nombre",
  email: "Correo electrónico",
  country: "País",
  selectCountry: "Selecciona tu país",
  prayerRequest: "Petición de oración",
  optional: "(opcional)",
  prayerPlaceholder: "Comparte una petición de oración (opcional)...",
  joinConference: "Unirse a la conferencia",
  startsIn: "Comienza en {time}",
  sessionExpiredPre: "Tu sesión de administrador expiró. Para presentar esta conferencia, ",
  signInAgain: "inicia sesión de nuevo",
  startingSoon: "Comienza pronto",
  startingNow: "Comenzando…",
  hours: "Horas",
  minutes: "Minutos",
  seconds: "Segundos",
  scheduledFor: "Programada para",
  waitingOne: "{n} persona esperando",
  waitingMany: "{n} personas esperando",
  shareConference: "Comparte esta conferencia",
  copyLink: "Copiar enlace",
  copied: "¡Copiado!",
  startNow: "Comenzar ahora",
  give: "Ofrendar",
  share: "Compartir",
  preview: "Vista previa",
  participants: "Participantes",
  previewingBanner: "Vista previa como asistente: esto es exactamente lo que ven.",
  exitPreview: "Salir de la vista previa",
  loading: "Cargando conferencia...",
  error: "Error",
  roomNotFound: "Sala no encontrada. Verifica el código e inténtalo de nuevo.",
  conferenceEnded: "Conferencia finalizada",
  hasEnded: "{name} ha finalizado.",
  removed: "Expulsado",
  removedMsg: "Has sido expulsado de esta conferencia.",
  backHome: "Volver al inicio",
  liveChat: "Chat en vivo",
  chat: "Chat",
  prayerRequests: "Peticiones de oración",
  noMessages: "Aún no hay mensajes. ¡Sé el primero en comentar!",
  typeMessage: "Escribe un mensaje...",
  send: "Enviar",
  noPrayers: "Aún no hay peticiones de oración.",
  giveOffering: "Dar una ofrenda",
  support: "Apoya a {name}",
  giveWithPaypal: "Dar con PayPal",
  cardOrPaypal: "Tarjeta o saldo de PayPal",
  regionalMethod: "Método de pago regional",
  close: "Cerrar",
  tapToUnmute: "Toca para activar el sonido",
  language: "Idioma",
};

const fr: Dict = {
  joinSubtitle: "Entrez vos informations pour rejoindre la conférence",
  yourName: "Votre nom",
  namePlaceholder: "Entrez votre nom",
  email: "E-mail",
  country: "Pays",
  selectCountry: "Sélectionnez votre pays",
  prayerRequest: "Demande de prière",
  optional: "(facultatif)",
  prayerPlaceholder: "Partagez une demande de prière (facultatif)...",
  joinConference: "Rejoindre la conférence",
  startsIn: "Commence dans {time}",
  sessionExpiredPre: "Votre session administrateur a expiré. Pour animer cette conférence, ",
  signInAgain: "reconnectez-vous",
  startingSoon: "Commence bientôt",
  startingNow: "Démarrage…",
  hours: "Heures",
  minutes: "Minutes",
  seconds: "Secondes",
  scheduledFor: "Prévue pour",
  waitingOne: "{n} personne en attente",
  waitingMany: "{n} personnes en attente",
  shareConference: "Partagez cette conférence",
  copyLink: "Copier le lien",
  copied: "Copié !",
  startNow: "Démarrer maintenant",
  give: "Donner",
  share: "Partager",
  preview: "Aperçu",
  participants: "Participants",
  previewingBanner: "Aperçu en tant que participant — voici exactement ce qu'ils voient.",
  exitPreview: "Quitter l'aperçu",
  loading: "Chargement de la conférence...",
  error: "Erreur",
  roomNotFound: "Salle introuvable. Vérifiez le code et réessayez.",
  conferenceEnded: "Conférence terminée",
  hasEnded: "{name} est terminée.",
  removed: "Exclu",
  removedMsg: "Vous avez été exclu de cette conférence.",
  backHome: "Retour à l'accueil",
  liveChat: "Chat en direct",
  chat: "Chat",
  prayerRequests: "Demandes de prière",
  noMessages: "Aucun message pour l'instant. Soyez le premier à commenter !",
  typeMessage: "Écrivez un message...",
  send: "Envoyer",
  noPrayers: "Aucune demande de prière pour l'instant.",
  giveOffering: "Faire une offrande",
  support: "Soutenez {name}",
  giveWithPaypal: "Donner avec PayPal",
  cardOrPaypal: "Carte ou solde PayPal",
  regionalMethod: "Moyen de paiement régional",
  close: "Fermer",
  tapToUnmute: "Appuyez pour activer le son",
  language: "Langue",
};

const pt: Dict = {
  joinSubtitle: "Insira seus dados para entrar na conferência",
  yourName: "Seu nome",
  namePlaceholder: "Digite seu nome",
  email: "E-mail",
  country: "País",
  selectCountry: "Selecione seu país",
  prayerRequest: "Pedido de oração",
  optional: "(opcional)",
  prayerPlaceholder: "Compartilhe um pedido de oração (opcional)...",
  joinConference: "Entrar na conferência",
  startsIn: "Começa em {time}",
  sessionExpiredPre: "Sua sessão de administrador expirou. Para apresentar esta conferência, ",
  signInAgain: "entre novamente",
  startingSoon: "Começa em breve",
  startingNow: "Começando…",
  hours: "Horas",
  minutes: "Minutos",
  seconds: "Segundos",
  scheduledFor: "Agendada para",
  waitingOne: "{n} pessoa aguardando",
  waitingMany: "{n} pessoas aguardando",
  shareConference: "Compartilhe esta conferência",
  copyLink: "Copiar link",
  copied: "Copiado!",
  startNow: "Começar agora",
  give: "Ofertar",
  share: "Compartilhar",
  preview: "Pré-visualização",
  participants: "Participantes",
  previewingBanner: "Pré-visualizando como participante — é exatamente o que eles veem.",
  exitPreview: "Sair da pré-visualização",
  loading: "Carregando conferência...",
  error: "Erro",
  roomNotFound: "Sala não encontrada. Verifique o código e tente novamente.",
  conferenceEnded: "Conferência encerrada",
  hasEnded: "{name} foi encerrada.",
  removed: "Removido",
  removedMsg: "Você foi removido desta conferência.",
  backHome: "Voltar ao início",
  liveChat: "Chat ao vivo",
  chat: "Chat",
  prayerRequests: "Pedidos de oração",
  noMessages: "Ainda não há mensagens. Seja o primeiro a comentar!",
  typeMessage: "Digite uma mensagem...",
  send: "Enviar",
  noPrayers: "Ainda não há pedidos de oração.",
  giveOffering: "Fazer uma oferta",
  support: "Apoie {name}",
  giveWithPaypal: "Ofertar com PayPal",
  cardOrPaypal: "Cartão ou saldo PayPal",
  regionalMethod: "Método de pagamento regional",
  close: "Fechar",
  tapToUnmute: "Toque para ativar o som",
  language: "Idioma",
};

const ar: Dict = {
  joinSubtitle: "أدخل بياناتك للانضمام إلى المؤتمر",
  yourName: "اسمك",
  namePlaceholder: "أدخل اسمك",
  email: "البريد الإلكتروني",
  country: "الدولة",
  selectCountry: "اختر دولتك",
  prayerRequest: "طلب صلاة",
  optional: "(اختياري)",
  prayerPlaceholder: "شارك طلب صلاة (اختياري)...",
  joinConference: "الانضمام إلى المؤتمر",
  startsIn: "يبدأ خلال {time}",
  sessionExpiredPre: "انتهت جلسة المشرف. لاستضافة هذا المؤتمر، ",
  signInAgain: "سجّل الدخول مرة أخرى",
  startingSoon: "يبدأ قريبًا",
  startingNow: "يبدأ الآن…",
  hours: "ساعات",
  minutes: "دقائق",
  seconds: "ثوانٍ",
  scheduledFor: "مُجدوَل في",
  waitingOne: "{n} شخص ينتظر",
  waitingMany: "{n} أشخاص ينتظرون",
  shareConference: "شارك هذا المؤتمر",
  copyLink: "نسخ الرابط",
  copied: "تم النسخ!",
  startNow: "ابدأ الآن",
  give: "تبرّع",
  share: "مشاركة",
  preview: "معاينة",
  participants: "المشاركون",
  previewingBanner: "معاينة كحاضر — هذا تمامًا ما يرونه.",
  exitPreview: "إنهاء المعاينة",
  loading: "جارٍ تحميل المؤتمر...",
  error: "خطأ",
  roomNotFound: "الغرفة غير موجودة. تحقق من الرمز وحاول مرة أخرى.",
  conferenceEnded: "انتهى المؤتمر",
  hasEnded: "انتهى {name}.",
  removed: "تمت الإزالة",
  removedMsg: "تمت إزالتك من هذا المؤتمر.",
  backHome: "العودة إلى الرئيسية",
  liveChat: "الدردشة المباشرة",
  chat: "الدردشة",
  prayerRequests: "طلبات الصلاة",
  noMessages: "لا توجد رسائل بعد. كن أول من يعلّق!",
  typeMessage: "اكتب رسالة...",
  send: "إرسال",
  noPrayers: "لا توجد طلبات صلاة بعد.",
  giveOffering: "قدّم تبرعًا",
  support: "ادعم {name}",
  giveWithPaypal: "التبرع عبر PayPal",
  cardOrPaypal: "بطاقة أو رصيد PayPal",
  regionalMethod: "طريقة دفع إقليمية",
  close: "إغلاق",
  tapToUnmute: "اضغط لتشغيل الصوت",
  language: "اللغة",
};

const DICTS: Record<Locale, Dict> = { en, es, fr, pt, ar };

interface Ctx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<Ctx>({
  locale: "en",
  setLocale: () => {},
  t: (k) => k,
});

function detectLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem("lang") as Locale | null;
  if (saved && DICTS[saved]) return saved;
  const nav = (navigator.language || "en").slice(0, 2).toLowerCase() as Locale;
  return DICTS[nav] ? nav : "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Detect the visitor's language on first mount (browser / saved choice).
  useEffect(() => {
    setLocaleState(detectLocale());
  }, []);

  // Apply text direction + lang to the document while on these pages.
  useEffect(() => {
    const html = document.documentElement;
    const prevDir = html.dir;
    const prevLang = html.lang;
    html.dir = locale === "ar" ? "rtl" : "ltr";
    html.lang = locale;
    return () => {
      html.dir = prevDir;
      html.lang = prevLang;
    };
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    localStorage.setItem("lang", l);
    setLocaleState(l);
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      let str = DICTS[locale][key] ?? DICTS.en[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        }
      }
      return str;
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useT() {
  return useContext(LanguageContext);
}
