import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "sonner";
import {
  getCurrentSessionService,
  getCurrentUser,
} from "@/services/users.service";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const allCookie = (await cookies())
    .getAll()
    .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
    .join("; ");

  const user = await getCurrentUser({
    headers: {
      Cookie: allCookie,
    },
  });

  const session = await getCurrentSessionService({
    headers: {
      Cookie: allCookie,
    },
  });
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}  font-sans antialiased`}
      >
        <AuthProvider initUser={user} initSession={session}>
          {children}
        </AuthProvider>
        <Toaster visibleToasts={5} richColors />
      </body>
    </html>
  );
}
