import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Izjava o dostopnosti" };

export default function AccessibilityPage() {
  return (
    <LegalPage eyebrow="Vključujoča uporaba" title="Dostopnost" intro="Splet želimo približati vsem uporabnikom, ne glede na njihove sposobnosti, napravo ali način uporabe.">
      <h2>Naša zaveza</h2>
      <p>Spletno stran razvijamo v skladu s smernicami WCAG 2.2 na ravni AA. Dostopnost razumemo kot stalen proces, zato stran preverjamo s tipkovnico, bralniki zaslona, povečavo in različnimi velikostmi zaslonov.</p>
      <h2>Podprte možnosti</h2>
      <ul>
        <li>semantična struktura in smiselno zaporedje naslovov,</li>
        <li>uporaba brez miške in dobro vidni indikatorji fokusa,</li>
        <li>povezava za preskok na glavno vsebino,</li>
        <li>zadostni barvni kontrasti in odzivna tipografija,</li>
        <li>opisna alternativna besedila vizualnih vsebin,</li>
        <li>omejitev animacij glede na nastavitev <code>prefers-reduced-motion</code>.</li>
      </ul>
      <h2>Povratne informacije</h2>
      <p>Če naletite na oviro ali potrebujete vsebino v drugi obliki, nam pišite na <a href="mailto:alen.kobilica@vidimcilj.si?subject=Dostopnost%20spletne%20strani">alen.kobilica@vidimcilj.si</a>. Prosimo, opišite stran in težavo; odgovorili bomo v najkrajšem možnem času.</p>
      <p className="legal-updated">Izjava pripravljena · julij 2026</p>
    </LegalPage>
  );
}
