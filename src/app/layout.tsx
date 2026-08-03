import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://eduqash.uz"),
  title: {
    default: "Eduqash — Qashqadaryo O'quv Markazlari va Kurslar Qidiruv Platformasi | eduqash.uz",
    template: "%s | Eduqash.uz — Qashqadaryo Ta'lim Platformasi",
  },
  description:
    "Eduqash.uz — Qashqadaryo viloyati (Qarshi, Shahrisabz, Kitob, Koson, Yakkabog', Chiroqchi) o'quv markazlari, IT, IELTS, Ingliz tili, Matematika, Robototexnika kurslari hamda malakali ustozlar qidiruv platformasi. Yo'nalishingizni toping va ta'lim maskanlariga bog'laning.",
  keywords: [
    "Eduqash",
    "eduqash.uz",
    "Qashqadaryo o'quv markazlari",
    "Qarshi o'quv markazlari",
    "Shahrisabz o'quv markazlari",
    "Kitob o'quv markazlari",
    "Koson o'quv markazlari",
    "Yakkabog' o'quv markazlari",
    "Qarshi IT kurslari",
    "Qashqadaryo IELTS kurslari",
    "Qarshi matematika repititori",
    "Qarshi ingliz tili kurslari",
    "Sfera Academy Qarshi",
    "Ideal Academy Qarshi",
    "IT Park Qarshi",
    "Registon Qarshi",
    "Qashqadaryo ta'lim platformasi",
    "Abituriyent tayyorlov Qarshi",
    "Robototexnika Shahrisabz",
  ],
  authors: [{ name: "Eduqash Platformasi", url: "https://eduqash.uz" }],
  creator: "Eduqash.uz",
  publisher: "Eduqash.uz",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://eduqash.uz",
  },
  openGraph: {
    title: "Eduqash — Qashqadaryo O'quv Markazlari Qidiruv Platformasi | eduqash.uz",
    description:
      "Qashqadaryodagi nufuzli o'quv markazlari, IT, IELTS, Matematika kurslari hamda tajribali ustozlarni izlang va fikr-mulohaza qoldiring.",
    url: "https://eduqash.uz",
    siteName: "Eduqash.uz",
    locale: "uz_UZ",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Eduqash Qashqadaryo O'quv Markazlari Platformasi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eduqash — Qashqadaryo O'quv Markazlari Platformasi | eduqash.uz",
    description:
      "Qashqadaryo viloyatidagi barcha ta'lim maskanlari va o'qituvchilar katalogi.",
    images: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&h=630&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className="antialiased font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
