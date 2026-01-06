'use client';

import { useRouter } from 'next/navigation';

import Button from '@/components/Button';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function SignOutButton({ label }: { label: string }) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <Button type="button" variant="secondary" onClick={handleSignOut}>
      {label}
    </Button>
  );
}
