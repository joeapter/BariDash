import { redirect, notFound } from 'next/navigation';

import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function getCurrentUser() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function requireUser(locale: string) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/${locale}/account`);
  }

  return user;
}

export async function requireAdmin(locale: string) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    redirect(`/${locale}/account`);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    notFound();
  }

  return user;
}
