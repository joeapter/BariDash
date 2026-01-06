export function localizeField(
  locale: string,
  field: { en?: string | null; he?: string | null }
) {
  return locale === 'he' ? field.he ?? field.en ?? '' : field.en ?? field.he ?? '';
}
