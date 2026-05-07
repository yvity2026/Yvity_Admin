

import {
  Geist,
  Geist_Mono,
  Cormorant_Garamond,
  Nunito,
  Poppins,
} from "next/font/google";
import "./globals.css";

// ✅ FIXED HERE
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthAdminContext";
import { ModalProvider } from "@/context/ModalContext";
import { SidebarProvider } from "@/context/SidebarContext";
import AppShell from "@/components/Sidebar/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-nunito",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "YVITY",
  description: "Credibility that Connects",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${nunito.variable} ${poppins.variable} h-full antialiased bg-[#F8F6F1]`}
    >
    <body className={`${poppins.className} min-h-full flex flex-col`}>
        <main className="flex-1 flex flex-col">
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                zIndex: 99999,
              },
            }}
          />
          <AuthProvider>
            <ModalProvider>
              <AppShell>
              <SidebarProvider>
                {children}
                </SidebarProvider>
              </AppShell>
            </ModalProvider>
          </AuthProvider>
        </main>
      </body>
    </html>
  );
}
