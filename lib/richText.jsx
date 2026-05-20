/**
 * Tiny rich-text parser used across the template.
 *
 * Supported markers in content.js strings:
 *   {gradient}...{/gradient}   -> rendered with gradient-text + italic
 *   {stroke}...{/stroke}       -> rendered as outlined text
 *   {italic}...{/italic}       -> rendered italic only
 *
 * Anything outside the markers renders as a normal span.
 */

const MARKER = /\{(gradient|stroke|italic)\}([\s\S]*?)\{\/\1\}/g;

export function RichText({ text, className = "" }) {
  if (!text) return null;
  const parts = [];
  let last = 0;
  let key = 0;
  let m;
  // Reset regex state in case it was used elsewhere
  MARKER.lastIndex = 0;
  while ((m = MARKER.exec(text)) !== null) {
    if (m.index > last) {
      parts.push(
        <span key={key++}>{text.slice(last, m.index)}</span>
      );
    }
    const tag = m[1];
    const inner = m[2];
    if (tag === "gradient") {
      parts.push(
        <span key={key++} className="gradient-text italic">
          {inner}
        </span>
      );
    } else if (tag === "stroke") {
      parts.push(
        <span key={key++} className="text-stroke">
          {inner}
        </span>
      );
    } else if (tag === "italic") {
      parts.push(
        <span key={key++} className="italic">
          {inner}
        </span>
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    parts.push(<span key={key++}>{text.slice(last)}</span>);
  }
  return <span className={className}>{parts}</span>;
}
