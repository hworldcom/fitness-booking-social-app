export function profileInitials(displayName: string) {
  const words = displayName.trim().split(/\s+/u).filter(Boolean);
  const letterOrNumber = /[\p{L}\p{N}]/u;
  const significantCharacters = (word: string) =>
    Array.from(word.normalize("NFKC")).filter((character) =>
      letterOrNumber.test(character),
    );

  if (words.length === 0) return "?";
  if (words.length === 1) {
    return (
      significantCharacters(words[0]).slice(0, 2).join("").toUpperCase() || "?"
    );
  }

  const first = significantCharacters(words[0])[0] ?? "";
  const last = significantCharacters(words.at(-1) ?? "")[0] ?? "";
  return `${first}${last}`.toUpperCase() || "?";
}
