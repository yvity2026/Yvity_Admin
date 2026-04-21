import {
  Geist,
  Geist_Mono,
  Cormorant_Garamond,
  Nunito,
  Poppins,
} from "next/font/google";
import "./globals.css";
import AppShell from "./components/layout/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";
import { ModalProvider } from "@/context/ModalContext";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
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

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${nunito.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full max-w-384 mx-auto flex flex-col font-poppins">
        <AuthProvider>
          <ModalProvider>
            <SidebarProvider>
              <AppShell>
                <main className="flex-1 flex flex-col">
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      style: {
                        zIndex: 99999,
                      },
                    }}
                  />
                  {children}
                </main>
              </AppShell>
            </SidebarProvider>
          </ModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
