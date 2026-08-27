import type { Metadata } from "next";
import Container from "@/components/Container";
import SearchClient from "@/components/SearchClient";

export const metadata: Metadata = {
  title: "Axtarış",
  description: "Be Positive News xəbərləri arasında axtarış edin.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchPage() {
  return (
    <Container className="flex flex-col gap-8 py-10 sm:py-14">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">Axtarış</span>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Xəbərlərdə axtar</h1>
      </div>

      <SearchClient />
    </Container>
  );
}
