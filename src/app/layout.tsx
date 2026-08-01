import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Eduqash — Qashqadaryo O'quv Markazlari Qidiruv Platformasi",
  description:
    "Qarshi, Shahrisabz, Kitob, Koson va barcha tumanlardagi o'quv markazlari, IT, Ingliz tili, Matematika kurslari hamda tajribali ustozlarni qidiring.",
  keywords: [
    "Qashqadaryo",
    "Qarshi",
    "Shahrisabz",
    "Kitob",
    "Koson",
    "O'quv markazlar",
    "IT kurslar",
    "IELTS",
    "Eduqash",
  ],
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
