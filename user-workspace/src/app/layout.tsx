import "../app/globals.css";
import Sidebar from "../components/ui/sidebar";

export const metadata = {
  title: "VPN Reseller Billing & Management Suite",
  description: "سامانه مدیریت فروش VPN",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <head />
      <body className="flex">
        <Sidebar />
        <main className="flex-1 min-h-screen p-6 bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}
