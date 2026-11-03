export function attribute (string: unknown): string {
  return string || string === 0
    ? String(string)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
    : ''
}

export function HTML (string: unknown): string {
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
