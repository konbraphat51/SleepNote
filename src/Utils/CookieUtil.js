// SleepNote — minimal cookie reader/writer used for persistence.

const DefaultExpireDays = 365

// Read and URL-decode a cookie by name, or null when absent.
export function readCookie(name) {
  const prefix = `${name}=`
  const parts = document.cookie.split('; ')
  for (const part of parts) {
    if (part.startsWith(prefix)) {
      return decodeURIComponent(part.slice(prefix.length))
    }
  }
  return null
}

// Write a cookie with a URL-encoded value.
export function writeCookie(name, value, expireDays = DefaultExpireDays) {
  const expires = new Date(Date.now() + expireDays * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

// Remove a cookie by expiring it.
export function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`
}
