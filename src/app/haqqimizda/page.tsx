import type { Metadata } from "next";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "Haqqımızda",
  description: "Be Positive News — müstəqil, yoxlanılmış yaxşı xəbərlər nəşri.",
};

export default function AboutPage() {
  return (
    <Container className="flex flex-col gap-10 py-10 sm:py-14">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-wide text-accent">Haqqımızda</span>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Be Positive News haqqında</h1>
        <p className="mt-4 text-lg text-foreground/70">
          Be Positive News — bir fikir üzərində qurulmuş müstəqil nəşrdir: dünya, başlıqların göstərdiyindən
          qat-qat çox yaxşı xəbərlə yaşayır.
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-4xl gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-border-subtle bg-surface p-6">
          <h2 className="text-lg font-bold">Missiyamız</h2>
          <p className="mt-2 text-sm text-foreground/70">
            Tibb, iqlim həlləri, texnologiya və cəmiyyətlərdəki həqiqi irəliləyişlər barədə, istənilən
            redaksiya qədər ciddi, lakin qorxu yaratmadan xəbər veririk.
          </p>
        </div>
        <div className="rounded-2xl border border-border-subtle bg-surface p-6">
          <h2 className="text-lg font-bold">Necə işləyirik</h2>
          <p className="mt-2 text-sm text-foreground/70">
            Mənbələri yoxlayırıq, orijinal jurnalist işini qeyd edirik və şişirtmədən uzaq dururuq. Müsbət
            olmaq tənqidsiz olmaq demək deyil.
          </p>
        </div>
        <div className="rounded-2xl border border-border-subtle bg-surface p-6">
          <h2 className="text-lg font-bold">Qlobal baxış</h2>
          <p className="mt-2 text-sm text-foreground/70">
            Hazırda Azərbaycan dilində nəşr edirik və Cənubi Qafqaz oxucularına xidmət göstəririk. İngilis
            dili də daxil olmaqla daha çox dil planlaşdırılır.
          </p>
        </div>
      </div>
    </Container>
  );
}
