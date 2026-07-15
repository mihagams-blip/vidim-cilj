"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Logo } from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";
import { formatNewsDate, slugify, type NewsPost, type NewsPostStatus } from "@/lib/news";
import type { SiteContent, SiteSectionKey } from "@/lib/site-content";

type AdminView = "overview" | "content" | "news" | "settings";
type FieldDefinition = { path: string; label: string; type?: "text" | "email" | "url"; long?: boolean; help?: string };

const sectionLabels: Record<SiteSectionKey, { label: string; description: string }> = {
  hero: { label: "Hero", description: "Glavno sporočilo na vrhu strani" },
  founder: { label: "Alenova zgodba", description: "Predstavitev ustanovitelja" },
  news: { label: "Uvod v novice", description: "Naslov in spremno besedilo novic" },
  mission: { label: "Poslanstvo", description: "Vrednote in osrednje sporočilo" },
  programs: { label: "Programi", description: "Športni programi in opisi" },
  journey: { label: "Pot proti cilju", description: "Tri stopnje poti" },
  moments: { label: "Trenutki", description: "Naslov galerije" },
  support: { label: "Podpora", description: "Poziv podpornikom" },
  contact: { label: "Kontakt", description: "Kontaktni in družbeni podatki" },
  footer: { label: "Noga strani", description: "Slogan in partner" },
};

const valueFields = Array.from({ length: 4 }, (_, index) => [
  { path: `values.${index}.title`, label: `Vrednota ${index + 1} — naziv` },
  { path: `values.${index}.statement`, label: `Vrednota ${index + 1} — poudarek` },
  { path: `values.${index}.text`, label: `Vrednota ${index + 1} — opis`, long: true },
]).flat();

const programFields = Array.from({ length: 4 }, (_, index) => [
  { path: `items.${index}.title`, label: `Program ${index + 1} — naziv` },
  { path: `items.${index}.text`, label: `Program ${index + 1} — opis`, long: true },
]).flat();

const journeyFields = Array.from({ length: 3 }, (_, index) => [
  { path: `steps.${index}.label`, label: `Korak ${index + 1} — oznaka` },
  { path: `steps.${index}.title`, label: `Korak ${index + 1} — poudarek` },
  ...(index === 2 ? [{ path: `steps.${index}.note`, label: "Zaključna misel", long: true }] : []),
]).flat();

const sectionFields: Record<SiteSectionKey, FieldDefinition[]> = {
  hero: [
    { path: "eyebrow", label: "Nadnaslov" }, { path: "title", label: "Glavni naslov" },
    { path: "accent", label: "Barvni poudarek naslova" }, { path: "lead", label: "Podnaslov" },
    { path: "intro", label: "Uvodno besedilo", long: true }, { path: "proofTitle", label: "Poudarek ob fotografiji" },
    { path: "proofText", label: "Dopolnilo poudarka", long: true },
  ],
  founder: [
    { path: "eyebrow", label: "Nadnaslov" }, { path: "title", label: "Naslov" },
    { path: "accent", label: "Barvni poudarek naslova" }, { path: "lead", label: "Uvod", long: true },
    { path: "body", label: "Glavno besedilo", long: true }, { path: "quote", label: "Citat", long: true },
    { path: "name", label: "Ime" }, { path: "role", label: "Vloga" },
  ],
  news: [
    { path: "eyebrow", label: "Nadnaslov" }, { path: "title", label: "Naslov" },
    { path: "accent", label: "Barvni poudarek naslova" }, { path: "intro", label: "Uvod", long: true },
    { path: "facebookNote", label: "Facebook obvestilo", long: true },
  ],
  mission: [
    { path: "eyebrow", label: "Nadnaslov" }, { path: "title", label: "Naslov" },
    { path: "accent", label: "Barvni poudarek naslova" }, { path: "intro", label: "Uvod", long: true },
    { path: "manifesto", label: "Manifest — začetek" }, { path: "manifestoAccent", label: "Manifest — poudarek" },
    ...valueFields,
  ],
  programs: [
    { path: "eyebrow", label: "Nadnaslov" }, { path: "title", label: "Naslov" },
    { path: "accent", label: "Barvni poudarek naslova" }, { path: "intro", label: "Uvod", long: true },
    { path: "note", label: "Zaključni poziv" }, ...programFields,
  ],
  journey: [
    { path: "eyebrow", label: "Nadnaslov" }, { path: "title", label: "Naslov" },
    { path: "accent", label: "Barvni poudarek naslova" }, { path: "intro", label: "Uvod", long: true },
    ...journeyFields,
  ],
  moments: [
    { path: "eyebrow", label: "Nadnaslov" }, { path: "title", label: "Naslov" },
    { path: "accent", label: "Barvni poudarek naslova" }, { path: "note", label: "Opomba pod galerijo", long: true },
  ],
  support: [
    { path: "eyebrow", label: "Nadnaslov" }, { path: "title", label: "Naslov" },
    { path: "accent", label: "Barvni poudarek naslova" }, { path: "text", label: "Besedilo", long: true },
    { path: "button", label: "Besedilo gumba" }, { path: "note", label: "Opomba", long: true },
  ],
  contact: [
    { path: "eyebrow", label: "Nadnaslov" }, { path: "title", label: "Naslov" },
    { path: "accent", label: "Barvni poudarek naslova" }, { path: "email", label: "E-pošta", type: "email" },
    { path: "addressLine1", label: "Naslov — prva vrstica" }, { path: "addressLine2", label: "Naslov — druga vrstica" },
    { path: "facebookUrl", label: "Facebook URL", type: "url" },
  ],
  footer: [
    { path: "tagline", label: "Slogan" }, { path: "partnerLabel", label: "Oznaka partnerja" },
    { path: "partnerName", label: "Ime partnerja" },
  ],
};

function readPath(source: unknown, path: string): string {
  return path.split(".").reduce<unknown>((value, key) => {
    if (Array.isArray(value)) return value[Number(key)];
    if (value && typeof value === "object") return (value as Record<string, unknown>)[key];
    return "";
  }, source) as string || "";
}

function writePath<T>(source: T, path: string, value: string): T {
  const clone = structuredClone(source);
  const keys = path.split(".");
  let cursor: unknown = clone;
  keys.slice(0, -1).forEach((key) => {
    cursor = Array.isArray(cursor)
      ? cursor[Number(key)]
      : (cursor as Record<string, unknown>)[key];
  });
  const last = keys.at(-1)!;
  if (Array.isArray(cursor)) cursor[Number(last)] = value;
  else (cursor as Record<string, unknown>)[last] = value;
  return clone;
}

function emptyPost(): NewsPost {
  const now = new Date().toISOString();
  return {
    id: "", slug: "", title: "", excerpt: "", body: "", category: "Aktualno",
    cover_image_url: null, cover_image_alt: null, image_credit: null, status: "draft",
    featured: false, published_at: null, created_at: now, updated_at: now,
  };
}

export function AdminApp({
  initialContent,
  initialPosts,
  configured,
  userEmail,
  userRole,
}: {
  initialContent: SiteContent;
  initialPosts: NewsPost[];
  configured: boolean;
  userEmail: string;
  userRole: "admin" | "editor" | "setup";
}) {
  const [view, setView] = useState<AdminView>("overview");
  const [selectedSection, setSelectedSection] = useState<SiteSectionKey>("hero");
  const [content, setContent] = useState(initialContent);
  const [posts, setPosts] = useState(initialPosts);
  const [editingPost, setEditingPost] = useState<NewsPost | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const publishedCount = posts.filter((post) => post.status === "published").length;
  const draftCount = posts.length - publishedCount;

  const sectionValue = content[selectedSection];
  const currentFields = useMemo(() => sectionFields[selectedSection], [selectedSection]);

  function showNotice(message: string) {
    setError("");
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  }

  async function saveSection() {
    setBusy(true);
    setError("");
    if (!configured) {
      setBusy(false);
      showNotice("Predogled je posodobljen lokalno. Za trajno shranjevanje povežemo Supabase.");
      return;
    }

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    const { error: saveError } = await supabase.from("site_sections").upsert({
      section_key: selectedSection,
      locale: "sl",
      content: sectionValue,
      updated_by: userData.user?.id ?? null,
    }, { onConflict: "section_key,locale" });

    setBusy(false);
    if (saveError) setError(saveError.message);
    else showNotice(`Sekcija »${sectionLabels[selectedSection].label}« je shranjena.`);
  }

  function changeSectionField(field: FieldDefinition, value: string) {
    setContent((current) => ({
      ...current,
      [selectedSection]: writePath(current[selectedSection], field.path, value),
    }));
  }

  async function savePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingPost) return;
    setError("");
    const slug = editingPost.slug || slugify(editingPost.title);
    if (!editingPost.title.trim() || !slug) {
      setError("Naslov novice je obvezen.");
      return;
    }
    if (editingPost.status === "published" && (!editingPost.excerpt.trim() || !editingPost.body.trim())) {
      setError("Za objavo sta obvezna povzetek in vsebina.");
      return;
    }
    if (editingPost.status === "published" && editingPost.cover_image_url && !editingPost.cover_image_alt?.trim()) {
      setError("Objavljena fotografija potrebuje alternativni opis.");
      return;
    }

    setBusy(true);
    const now = new Date().toISOString();
    const payload = {
      ...editingPost,
      slug,
      published_at: editingPost.status === "published" ? (editingPost.published_at ?? now) : null,
      updated_at: now,
    };

    if (!configured) {
      const localPost = { ...payload, id: payload.id || `preview-${Date.now()}` };
      setPosts((current) => [localPost, ...current.filter((post) => post.id !== localPost.id)]);
      setEditingPost(localPost);
      setBusy(false);
      showNotice("Novica je shranjena v predogledu. Po povezavi Supabase bo shranjevanje trajno.");
      return;
    }

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    const databasePayload = {
      slug: payload.slug,
      title: payload.title,
      excerpt: payload.excerpt,
      body: payload.body,
      category: payload.category,
      cover_image_url: payload.cover_image_url,
      cover_image_alt: payload.cover_image_alt,
      image_credit: payload.image_credit,
      status: payload.status,
      featured: payload.featured,
      published_at: payload.published_at,
      updated_at: payload.updated_at,
      updated_by: userData.user?.id ?? null,
      ...(!payload.id ? { created_by: userData.user?.id ?? null } : {}),
    };
    const query = payload.id
      ? supabase.from("posts").update(databasePayload).eq("id", payload.id)
      : supabase.from("posts").insert(databasePayload);
    const { data, error: saveError } = await query.select("*").single();
    setBusy(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    const saved = data as NewsPost;
    setPosts((current) => [saved, ...current.filter((post) => post.id !== saved.id && post.id !== payload.id)]);
    setEditingPost(saved);
    showNotice(saved.status === "published" ? "Novica je objavljena." : "Osnutek je shranjen.");
  }

  async function deletePost(post: NewsPost) {
    if (!window.confirm(`Ali res želite izbrisati novico »${post.title}«?`)) return;
    if (configured) {
      const { error: deleteError } = await createClient().from("posts").delete().eq("id", post.id);
      if (deleteError) {
        setError(deleteError.message);
        return;
      }
    }
    setPosts((current) => current.filter((item) => item.id !== post.id));
    if (editingPost?.id === post.id) setEditingPost(null);
    showNotice("Novica je izbrisana.");
  }

  async function uploadCover(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !editingPost) return;
    if (!file.type.startsWith("image/") || file.size > 8 * 1024 * 1024) {
      setError("Izberite fotografijo JPG, PNG ali WebP do 8 MB.");
      return;
    }
    if (!configured) {
      setEditingPost({ ...editingPost, cover_image_url: URL.createObjectURL(file) });
      showNotice("Fotografija je dodana predogledu. Supabase jo bo pozneje shranil trajno.");
      return;
    }
    setBusy(true);
    const safeName = slugify(file.name.replace(/\.[^.]+$/, "")) || "fotografija";
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `news/${crypto.randomUUID()}-${safeName}.${extension}`;
    const supabase = createClient();
    const { error: uploadError } = await supabase.storage.from("public-media").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    setBusy(false);
    if (uploadError) {
      setError(uploadError.message);
      return;
    }
    const { data } = supabase.storage.from("public-media").getPublicUrl(path);
    setEditingPost({ ...editingPost, cover_image_url: data.publicUrl });
    showNotice("Fotografija je naložena.");
  }

  async function signOut() {
    if (configured) await createClient().auth.signOut();
    window.location.href = configured ? "/admin/login" : "/";
  }

  return (
    <div className="admin-shell">
      <a className="skip-link" href="#admin-main">Preskoči na urejanje</a>
      <aside className="admin-sidebar">
        <Link href="/" className="admin-brand" aria-label="Vidim cilj — javna stran"><Logo /></Link>
        <nav aria-label="Administratorska navigacija">
          <button type="button" className={view === "overview" ? "is-active" : ""} onClick={() => setView("overview")}><i>01</i><span>Nadzorna plošča</span></button>
          <button type="button" className={view === "content" ? "is-active" : ""} onClick={() => setView("content")}><i>02</i><span>Vsebina strani</span></button>
          <button type="button" className={view === "news" ? "is-active" : ""} onClick={() => setView("news")}><i>03</i><span>Novice</span><b>{posts.length}</b></button>
          <button type="button" className={view === "settings" ? "is-active" : ""} onClick={() => setView("settings")}><i>04</i><span>Nastavitve</span></button>
        </nav>
        <div className="admin-user">
          <span>{userEmail.slice(0, 1).toUpperCase()}</span>
          <div><strong>{userEmail}</strong><small>{userRole === "admin" ? "Administrator" : userRole === "editor" ? "Urednik" : "Predogled"}</small></div>
          <button type="button" onClick={signOut} aria-label="Odjava">↗</button>
        </div>
      </aside>

      <main className="admin-main" id="admin-main">
        <header className="admin-topbar">
          <div><span className={`admin-status-dot ${configured ? "is-live" : ""}`} />{configured ? "Povezano s Supabase" : "Način za predogled"}</div>
          <Link href="/" target="_blank">Odpri spletno stran ↗</Link>
        </header>

        {notice ? <div className="admin-toast" role="status">✓ {notice}</div> : null}
        {error ? <div className="admin-error-banner" role="alert">{error}</div> : null}

        {view === "overview" ? (
          <section className="admin-view" aria-labelledby="overview-title">
            <div className="admin-page-heading"><div><p className="admin-kicker">Dobrodošli v uredništvu</p><h1 id="overview-title">Vsebina, ki premika.</h1></div><button className="admin-primary-button" type="button" onClick={() => { setEditingPost(emptyPost()); setView("news"); }}>+ Nova novica</button></div>
            {!configured ? <div className="admin-setup-banner"><span>1</span><div><strong>Naslednji korak: povežimo Supabase</strong><p>Vmesnik je pripravljen. Ko dodamo projektne ključe in zaženemo SQL migracijo, se vključijo Google prijava, trajno shranjevanje in nalaganje fotografij.</p></div></div> : null}
            <div className="admin-metrics">
              <article><small>Objavljene novice</small><strong>{publishedCount}</strong><span>vidne obiskovalcem</span></article>
              <article><small>Osnutki</small><strong>{draftCount}</strong><span>čakajo na objavo</span></article>
              <article><small>Urejevalne sekcije</small><strong>{Object.keys(sectionLabels).length}</strong><span>zaščitena postavitev</span></article>
            </div>
            <div className="admin-overview-grid">
              <section className="admin-panel"><div className="admin-panel-title"><div><p className="admin-kicker">Nedavno</p><h2>Novice</h2></div><button type="button" onClick={() => setView("news")}>Prikaži vse</button></div>{posts.length ? <div className="admin-recent-list">{posts.slice(0, 4).map((post) => <button type="button" key={post.id} onClick={() => { setEditingPost(post); setView("news"); }}><span className={`admin-post-status ${post.status}`} /> <div><strong>{post.title}</strong><small>{post.status === "published" ? formatNewsDate(post.published_at) : "Osnutek"}</small></div><b>→</b></button>)}</div> : <div className="admin-empty"><strong>Še ni novic.</strong><p>Ustvarite prvi osnutek in preverite uredniški tok.</p></div>}</section>
              <section className="admin-panel admin-quick"><p className="admin-kicker">Hitri dostop</p><h2>Uredite stran</h2><div>{(["hero", "founder", "mission", "contact"] as SiteSectionKey[]).map((key) => <button type="button" key={key} onClick={() => { setSelectedSection(key); setView("content"); }}><span>{sectionLabels[key].label}</span><small>{sectionLabels[key].description}</small><b>→</b></button>)}</div></section>
            </div>
          </section>
        ) : null}

        {view === "content" ? (
          <section className="admin-view" aria-labelledby="content-title">
            <div className="admin-page-heading"><div><p className="admin-kicker">Vsebina strani</p><h1 id="content-title">Urejajte besedila.</h1><p>Dizajn in animacije ostanejo zaščiteni; spreminjate samo vsebino.</p></div><button className="admin-primary-button" type="button" disabled={busy} onClick={saveSection}>{busy ? "Shranjujem …" : "Shrani spremembe"}</button></div>
            <div className="admin-content-layout">
              <nav className="admin-section-list" aria-label="Sekcije strani">{(Object.keys(sectionLabels) as SiteSectionKey[]).map((key) => <button type="button" key={key} className={selectedSection === key ? "is-active" : ""} onClick={() => setSelectedSection(key)}><span>{sectionLabels[key].label}</span><small>{sectionLabels[key].description}</small></button>)}</nav>
              <div className="admin-editor-panel">
                <div className="admin-editor-title"><span>{String((Object.keys(sectionLabels) as SiteSectionKey[]).indexOf(selectedSection) + 1).padStart(2, "0")}</span><div><h2>{sectionLabels[selectedSection].label}</h2><p>{sectionLabels[selectedSection].description}</p></div></div>
                <div className="admin-field-grid">{currentFields.map((field) => <label key={field.path} className={field.long ? "admin-field-wide" : ""}><span>{field.label}</span>{field.long ? <textarea rows={4} value={readPath(sectionValue, field.path)} onChange={(event) => changeSectionField(field, event.target.value)} /> : <input type={field.type ?? "text"} value={readPath(sectionValue, field.path)} onChange={(event) => changeSectionField(field, event.target.value)} />}{field.help ? <small>{field.help}</small> : null}</label>)}</div>
                <div className="admin-editor-footer"><small>Spremembe postanejo vidne po shranjevanju.</small><button className="admin-primary-button" type="button" disabled={busy} onClick={saveSection}>{busy ? "Shranjujem …" : "Shrani sekcijo"}</button></div>
              </div>
            </div>
          </section>
        ) : null}

        {view === "news" ? (
          <section className="admin-view" aria-labelledby="news-admin-title">
            <div className="admin-page-heading"><div><p className="admin-kicker">Uredništvo</p><h1 id="news-admin-title">Novice.</h1><p>Pripravite osnutek, preverite vsebino in jo objavite.</p></div><button className="admin-primary-button" type="button" onClick={() => setEditingPost(emptyPost())}>+ Nova novica</button></div>
            <div className={`admin-news-layout ${editingPost ? "has-editor" : ""}`}>
              <div className="admin-post-list">{posts.length ? posts.map((post) => <article key={post.id} className={editingPost?.id === post.id ? "is-active" : ""}><button type="button" onClick={() => setEditingPost(post)}><span className={`admin-post-status ${post.status}`} /><div><small>{post.category} · {post.status === "published" ? formatNewsDate(post.published_at) : "Osnutek"}</small><strong>{post.title}</strong><p>{post.excerpt || "Brez povzetka"}</p></div><b>→</b></button><button className="admin-delete-post" type="button" onClick={() => deletePost(post)} aria-label={`Izbriši ${post.title}`}>×</button></article>) : <div className="admin-empty admin-empty-large"><strong>Prva zgodba se začne tukaj.</strong><p>Ustvarite novico, dodajte fotografijo in jo najprej shranite kot osnutek.</p><button className="admin-secondary-button" type="button" onClick={() => setEditingPost(emptyPost())}>Ustvari prvo novico</button></div>}</div>
              {editingPost ? <form className="admin-post-editor" onSubmit={savePost}><div className="admin-post-editor-head"><div><p className="admin-kicker">{editingPost.id ? "Urejanje novice" : "Nova novica"}</p><h2>{editingPost.title || "Brez naslova"}</h2></div><button type="button" onClick={() => setEditingPost(null)} aria-label="Zapri urejevalnik">×</button></div>
                <div className="admin-field-grid"><label className="admin-field-wide"><span>Naslov *</span><input value={editingPost.title} onChange={(event) => setEditingPost({ ...editingPost, title: event.target.value, slug: editingPost.id ? editingPost.slug : slugify(event.target.value) })} /></label><label><span>Kategorija</span><input value={editingPost.category} onChange={(event) => setEditingPost({ ...editingPost, category: event.target.value })} /></label><label><span>URL naslov</span><input value={editingPost.slug} onChange={(event) => setEditingPost({ ...editingPost, slug: slugify(event.target.value) })} /></label><label className="admin-field-wide"><span>Povzetek *</span><textarea rows={3} value={editingPost.excerpt} onChange={(event) => setEditingPost({ ...editingPost, excerpt: event.target.value })} /></label><label className="admin-field-wide"><span>Vsebina *</span><textarea className="admin-body-editor" rows={12} value={editingPost.body} onChange={(event) => setEditingPost({ ...editingPost, body: event.target.value })} /><small>Odstavke ločite s prazno vrstico.</small></label></div>
                <fieldset className="admin-media-field"><legend>Naslovna fotografija</legend>{editingPost.cover_image_url ? <div className="admin-cover-preview"><Image src={editingPost.cover_image_url} alt="Predogled naslovne fotografije" fill unoptimized sizes="(max-width: 760px) 100vw, 55vw" /><button type="button" onClick={() => setEditingPost({ ...editingPost, cover_image_url: null })}>Odstrani</button></div> : <label className="admin-upload-zone"><input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadCover} /><strong>Izberite fotografijo</strong><span>JPG, PNG ali WebP · največ 8 MB</span></label>}<div className="admin-field-grid"><label><span>Alternativni opis</span><input value={editingPost.cover_image_alt ?? ""} onChange={(event) => setEditingPost({ ...editingPost, cover_image_alt: event.target.value })} /><small>Opišite, kaj je pomembno na fotografiji.</small></label><label><span>Vir fotografije</span><input value={editingPost.image_credit ?? ""} onChange={(event) => setEditingPost({ ...editingPost, image_credit: event.target.value })} /></label></div></fieldset>
                <div className="admin-publish-box"><label><input type="checkbox" checked={editingPost.featured} onChange={(event) => setEditingPost({ ...editingPost, featured: event.target.checked })} /><span>Izpostavi na naslovnici</span></label><label><span>Status</span><select value={editingPost.status} onChange={(event) => setEditingPost({ ...editingPost, status: event.target.value as NewsPostStatus })}><option value="draft">Osnutek</option><option value="published">Objavljeno</option></select></label></div>
                <div className="admin-editor-footer"><small>{editingPost.status === "published" ? "Objava bo takoj vidna obiskovalcem." : "Osnutek ni viden obiskovalcem."}</small><div>{configured && editingPost.status === "published" && editingPost.slug ? <Link className="admin-secondary-button" href={`/novice/${editingPost.slug}`} target="_blank">Predogled ↗</Link> : null}<button className="admin-primary-button" type="submit" disabled={busy}>{busy ? "Shranjujem …" : editingPost.status === "published" ? "Objavi novico" : "Shrani osnutek"}</button></div></div>
              </form> : null}
            </div>
          </section>
        ) : null}

        {view === "settings" ? (
          <section className="admin-view" aria-labelledby="settings-title"><div className="admin-page-heading"><div><p className="admin-kicker">Nastavitve</p><h1 id="settings-title">Sistem.</h1><p>Pregled povezav in uredniškega dostopa.</p></div></div><div className="admin-settings-grid"><article><span className={`admin-status-dot ${configured ? "is-live" : ""}`} /><div><small>Podatkovna zbirka</small><strong>{configured ? "Supabase je povezan" : "Supabase čaka na povezavo"}</strong><p>{configured ? "Vsebina se trajno shranjuje in je zaščitena z RLS." : "Dodati moramo projektni URL in publishable key."}</p></div></article><article><span className="admin-status-dot is-live" /><div><small>Varnost</small><strong>Zaščitena postavitev</strong><p>Uredniki spreminjajo vsebino, ne kode ali dizajna.</p></div></article><article><span className={`admin-status-dot ${configured ? "is-live" : ""}`} /><div><small>Prijava</small><strong>{configured ? "Google OAuth" : "V pripravi"}</strong><p>Dostop dobijo samo e-poštni naslovi na seznamu urednikov.</p></div></article></div></section>
        ) : null}
      </main>
    </div>
  );
}
