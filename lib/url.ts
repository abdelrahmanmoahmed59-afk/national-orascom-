export function normalizeExternalUrl(input: string) {
  const url = input.trim()
  if (!url) return ""

  const lower = url.toLowerCase()
  if (lower.startsWith("http://") || lower.startsWith("https://")) return url
  if (lower.startsWith("mailto:") || lower.startsWith("tel:")) return url

  return `https://${url}`
}

