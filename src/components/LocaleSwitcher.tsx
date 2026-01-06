'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';

import { cn } from '@/lib/utils';

const locales = [
  { value: 'he', label: 'עברית' },
  { value: 'en', label: 'EN' }
];

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 rounded-full border border-emerald-200 bg-white/90 p-1 text-sm shadow-sm">
      {locales.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => router.replace(pathname, { locale: item.value })}
          className={cn(
            'rounded-full px-2.5 py-1 transition',
            locale === item.value
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-emerald-900 hover:bg-emerald-50'
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
