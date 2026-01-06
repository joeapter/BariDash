'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import Button from '@/components/Button';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function AccountAuthForm() {
  const t = useTranslations('account');
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    const supabase = createSupabaseBrowserClient();

    const result =
      mode === 'signin'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }

    router.refresh();
  }

  return (
    <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-emerald-950">{t('title')}</h2>
        <button
          type="button"
          className="text-sm font-semibold text-emerald-600 hover:text-emerald-800"
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
        >
          {mode === 'signin' ? t('signUp') : t('signIn')}
        </button>
      </div>
      <p className="mt-2 text-sm text-emerald-600">{t('subtitle')}</p>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-medium text-emerald-900">{t('email')}</label>
          <input
            type="email"
            name="email"
            required
            className="mt-2 w-full rounded-2xl border-emerald-200 bg-white px-4 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-emerald-900">{t('password')}</label>
          <input
            type="password"
            name="password"
            required
            className="mt-2 w-full rounded-2xl border-emerald-200 bg-white px-4 py-2"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {mode === 'signin' ? t('signIn') : t('signUp')}
        </Button>
      </form>
    </div>
  );
}
