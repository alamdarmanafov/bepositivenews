import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { getFeaturedArticle } from "@/content/articles";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const trend = getFeaturedArticle().title;

  return (
    <>
      <TopBar trend={trend} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
