import type { DiscoveryItem } from "@/domain/discovery";

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

function matches(query: string, text: string) {
  const haystack = normalize(text);
  return normalize(query.trim())
    .split(/\s+/)
    .every((term) => haystack.includes(term));
}

export function searchCatalogue(
  catalogue: readonly DiscoveryItem[],
  query: string,
) {
  if (!query.trim()) return [];
  return catalogue.filter((item) =>
    matches(query, `${item.title} ${item.detail} ${item.activity}`),
  );
}
