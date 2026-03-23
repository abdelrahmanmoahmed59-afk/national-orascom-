export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin")
  if (!origin) return true

  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim()
  const host = (forwardedHost || request.headers.get("host"))?.trim()
  if (!host) return true
  try {
    const originUrl = new URL(origin)
    // Ignore default ports to avoid false mismatches like:
    // Origin: https://example.com  vs Host: example.com:443
    const hostValue = host
    const hostName =
      hostValue.startsWith("[") && hostValue.includes("]")
        ? hostValue.slice(1, hostValue.indexOf("]"))
        : hostValue.split(":")[0]
    return originUrl.hostname === hostName
  } catch {
    return false
  }
}
