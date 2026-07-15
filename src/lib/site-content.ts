export type SiteContent = {
  hero: {
    eyebrow: string;
    title: string;
    accent: string;
    lead: string;
    intro: string;
    proofTitle: string;
    proofText: string;
  };
  founder: {
    eyebrow: string;
    title: string;
    accent: string;
    lead: string;
    body: string;
    quote: string;
    name: string;
    role: string;
  };
  news: {
    eyebrow: string;
    title: string;
    accent: string;
    intro: string;
    facebookNote: string;
  };
  mission: {
    eyebrow: string;
    title: string;
    accent: string;
    intro: string;
    manifesto: string;
    manifestoAccent: string;
    values: Array<{ title: string; statement: string; text: string }>;
  };
  programs: {
    eyebrow: string;
    title: string;
    accent: string;
    intro: string;
    note: string;
    items: Array<{ title: string; text: string }>;
  };
  journey: {
    eyebrow: string;
    title: string;
    accent: string;
    intro: string;
    steps: Array<{ label: string; title: string; note?: string }>;
  };
  moments: {
    eyebrow: string;
    title: string;
    accent: string;
    note: string;
  };
  support: {
    eyebrow: string;
    title: string;
    accent: string;
    text: string;
    button: string;
    note: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    accent: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    facebookUrl: string;
  };
  footer: {
    tagline: string;
    partnerLabel: string;
    partnerName: string;
  };
};

export type SiteSectionKey = keyof SiteContent;

export const defaultSiteContent: SiteContent = {
  hero: {
    eyebrow: "Gibanje, ki odpira svet",
    title: "Vsak otrok vidi svoj",
    accent: "cilj.",
    lead: "Mi mu pomagamo priti do njega.",
    intro:
      "S prilagojenim športom ustvarjamo prostor, kjer otroci in mladi odkrivajo svoje sposobnosti, gradijo samozavest in pripadajo.",
    proofTitle: "Vsak v svojem ritmu.",
    proofText: "Vsi proti istemu občutku: zmorem.",
  },
  founder: {
    eyebrow: "Začetek zgodbe",
    title: "Ko se ena pot zapre, poiščeš",
    accent: "nov cilj.",
    lead:
      "Alen Kobilica je po izgubi vida svojo izkušnjo spremenil v gibanje, ki danes odpira priložnosti drugim.",
    body:
      "Kot diplomirani profesor športa, parašportnik in ustanovitelj Centra Vidim cilj verjame, da ima vsak otrok potencial — potrebuje le priložnost, podporo in nekoga, ki z njim vidi cilj.",
    quote: "Ni hudo, če ne vidiš. Hudo je, če nimaš vizije.",
    name: "Alen Kobilica",
    role: "ustanovitelj Centra Vidim cilj",
  },
  news: {
    eyebrow: "Novice",
    title: "Novi koraki.",
    accent: "Pristne zgodbe.",
    intro:
      "Na tem mestu objavljamo najnovejše zgodbe s treningov, programov, dogodkov in poti proti novim ciljem.",
    facebookNote: "Aktualno dogajanje spremljajte tudi na Facebooku.",
  },
  mission: {
    eyebrow: "Naše poslanstvo",
    title: "Šport je začetek.",
    accent: "Življenje je cilj.",
    intro:
      "Ne merimo samo sekund, dolžin ali zavojev. Največji dosežek je trenutek, ko otrok verjame vase, naredi nekaj prvič in ve, da pri tem ni sam.",
    manifesto: "Ne iščemo meja. Iščemo",
    manifestoAccent: "načine.",
    values: [
      { title: "Samozavest", statement: "Zmorem.", text: "Otrok začuti, kaj vse zmore." },
      { title: "Samostojnost", statement: "Svoja pot.", text: "Nove spretnosti postanejo spretnosti za življenje." },
      { title: "Pripadnost", statement: "Skupaj.", text: "Tu nastajajo prijateljstva in varen prostor." },
      { title: "Vztrajnost", statement: "Še en korak.", text: "Vsak poskus je napredek proti lastnemu cilju." },
    ],
  },
  programs: {
    eyebrow: "Naši programi",
    title: "Prostor, kjer se",
    accent: "zgodi prvič.",
    intro:
      "Vsako aktivnost prilagodimo posamezniku. Z izkušenimi trenerji ustvarjamo varen prostor za učenje, veselje in napredek.",
    note: "Iščete pravo aktivnost za svojega otroka?",
    items: [
      { title: "Plavanje", text: "V vodi odkrivamo svobodo gibanja, gradimo tehniko in zaupanje vase — korak za korakom, v lastnem ritmu." },
      { title: "Gibalne aktivnosti", text: "Igra, ravnotežje in koordinacija postanejo prostor za radovednost, pogum in nove spretnosti." },
      { title: "Smučanje", text: "Na snegu se učimo zaupanja, samostojnosti in veselja ob premagovanju vsakega novega zavoja." },
      { title: "Tandemsko kolesarstvo", text: "Ko uskladimo ritem in si zaupamo, pot postane skupno doživetje brez meja." },
    ],
  },
  journey: {
    eyebrow: "Pot proti cilju",
    title: "Vsak korak",
    accent: "šteje.",
    intro: "Pot ni vedno ravna in cilj ni za vsakogar enak. Napredek se začne v trenutku, ko si upamo poskusiti.",
    steps: [
      { label: "Začetek", title: "Poskusim." },
      { label: "Pot", title: "Vztrajam." },
      { label: "Občutek", title: "Zmorem.", note: "To je cilj, ki ostane." },
    ],
  },
  moments: {
    eyebrow: "Pristni trenutki",
    title: "Majhni trenutki.",
    accent: "Veliki premiki.",
    note: "Avtentične fotografije so navedene z virom; neidentifikacijski športni detajli so ilustrativni.",
  },
  support: {
    eyebrow: "Postanite del zgodbe",
    title: "Pomagajte nam ustvarjati",
    accent: "nove priložnosti.",
    text: "Z vašo podporo lahko več otrok doživi svoj prvi zavesljaj, zavoj, cilj in predvsem občutek, da zmore.",
    button: "Pišite nam o podpori",
    note: "Skupaj poiščemo način sodelovanja, ki ima resničen učinek.",
  },
  contact: {
    eyebrow: "Stopimo v stik",
    title: "Imate vprašanje ali idejo?",
    accent: "Pišite nam.",
    email: "alen.kobilica@vidimcilj.si",
    addressLine1: "Dunajska cesta 78",
    addressLine2: "1000 Ljubljana",
    facebookUrl: "https://www.facebook.com/profile.php?id=100064338805726",
  },
  footer: {
    tagline: "Gibanje, ki odpira svet.",
    partnerLabel: "Program podpira",
    partnerName: "Mestna občina Ljubljana",
  },
};

export function mergeSiteContent(
  rows: Array<{ section_key: string; content: unknown }> | null | undefined,
): SiteContent {
  const merged = structuredClone(defaultSiteContent);
  for (const row of rows ?? []) {
    if (row.section_key in merged && row.content && typeof row.content === "object") {
      const key = row.section_key as SiteSectionKey;
      (merged[key] as Record<string, unknown>) = {
        ...(merged[key] as Record<string, unknown>),
        ...(row.content as Record<string, unknown>),
      };
    }
  }
  return merged;
}
