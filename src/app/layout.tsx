import type { Metadata } from "next";
import { Inter, Orbitron } from 'next/font/google';
import { SidebarNavigation } from '../components/layout/SidebarNavigation';
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
});

export const metadata: Metadata = {
  title: "4420 Courts Dealer Portal",
  description: "Complete dealer portal with accounting, commission tracking, and business management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${orbitron.variable} antialiased`}>
        <div className="min-h-screen bg-gray-50">
          <SidebarNavigation />
          <main className="lg:pl-72">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}