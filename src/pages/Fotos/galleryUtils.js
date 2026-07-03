export function slugify(str) {
  const slug = String(str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "gallery";
}

export function extractYoutubeVideoId(input) {
  if (!input || typeof input !== "string") return "";
  const trimmed = input.trim();

  const embedMatch = trimmed.match(/youtube\.com\/embed\/([^?&/]+)/);
  if (embedMatch) return embedMatch[1];

  const shortMatch = trimmed.match(/youtu\.be\/([^?&/]+)/);
  if (shortMatch) return shortMatch[1];

  const watchMatch = trimmed.match(/[?&]v=([^&]+)/);
  if (watchMatch) return watchMatch[1];

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  return "";
}

export function getYoutubeThumbnailUrl(input, quality = "hqdefault") {
  const id = extractYoutubeVideoId(input);
  if (!id) return "";
  return `https://img.youtube.com/vi/${id}/${quality}.jpg`;
}

export function toYoutubeEmbedUrl(input) {
  if (!input || typeof input !== "string") return "";
  const trimmed = input.trim();
  if (!trimmed) return "";

  if (trimmed.includes("/embed/")) {
    return trimmed.split("?")[0];
  }

  const shortMatch = trimmed.match(/youtu\.be\/([^?&/]+)/);
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  const watchMatch = trimmed.match(/[?&]v=([^&]+)/);
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return `https://www.youtube.com/embed/${trimmed}`;
  }

  return trimmed;
}

export function isYoutubeEmbedUrl(url) {
  return Boolean(extractYoutubeVideoId(url));
}
