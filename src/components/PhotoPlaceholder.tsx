import { Spark } from "./icons";

export function PhotoPlaceholder({
  label,
  className = "",
  tone = "blue",
}: {
  label: string;
  className?: string;
  tone?: "blue" | "sky" | "sun" | "deep";
}) {
  return (
    <div className={`photo-placeholder tone-${tone} ${className}`} role="img" aria-label={`${label}. Nadomestna grafika do prejema odobrene fotografije.`}>
      <div className="photo-orbit" aria-hidden="true" />
      <Spark className="photo-spark" />
      <span>{label}</span>
    </div>
  );
}
