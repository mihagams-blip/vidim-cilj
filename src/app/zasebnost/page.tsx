import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Zasebnost" };

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Pravne informacije" title="Zasebnost" intro="Vašo zasebnost spoštujemo. Stran je zasnovana tako, da zbira čim manj podatkov.">
      <h2>Upravljavec</h2>
      <p>Upravljavec spletne strani je Zavod Center Vidim cilj, Dunajska cesta 78, 1000 Ljubljana. Za vprašanja nam lahko pišete na <a href="mailto:alen.kobilica@vidimcilj.si">alen.kobilica@vidimcilj.si</a>.</p>
      <h2>Katere podatke obdelujemo</h2>
      <p>Javni del spletne strani nima registracije ali kontaktnega obrazca. Ob kliku na e-poštno povezavo komunikacijo opravite v svojem e-poštnem programu; podatke iz sporočila obdelujemo samo za odgovor na vaše povpraševanje. Ločeno administratorsko območje je namenjeno samo odobrenim urednikom in za prijavo uporablja Google ter Supabase Auth.</p>
      <h2>Piškotki in analitika</h2>
      <p>Osnovna različica strani ne uporablja lastnih oglaševalskih ali analitičnih piškotkov. Za prijavljene urednike se uporabljajo nujni sejni podatki za varno delovanje administracije. Če bodo pozneje dodane dodatne analitične storitve, bo ta politika pred objavo ustrezno dopolnjena.</p>
      <h2>Vdelana vsebina Facebooka</h2>
      <p>Na naslovnici je vdelana Facebookova stran, zato se lahko brskalnik ob prikazu tega dela poveže s storitvijo Meta. Meta lahko pri tem prejme tehnične podatke o obisku in uporabi svoje piškotke skladno z lastnimi pravili. Pred javno objavo je treba način nalaganja vdelane vsebine in to besedilo še pravno potrditi.</p>
      <h2>Vaše pravice</h2>
      <p>Glede dostopa, popravka, izbrisa ali drugih vprašanj o svojih osebnih podatkih nas kontaktirajte po e-pošti. Zahtevo bomo obravnavali skladno z veljavno zakonodajo.</p>
      <p className="legal-updated">Osnutek za pravni pregled · julij 2026</p>
    </LegalPage>
  );
}
