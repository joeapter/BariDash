import { createHmac } from 'crypto';
import { NextResponse } from 'next/server';

import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-meshulam-signature');

  if (process.env.MESHULAM_WEBHOOK_SECRET && signature) {
    const expected = createHmac('sha256', process.env.MESHULAM_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    if (expected !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const orderId =
    (payload.orderId as string | undefined) ||
    (payload.transactionId as string | undefined) ||
    (payload.invoiceId as string | undefined);
  const status = String(payload.status ?? payload.payment_status ?? '').toLowerCase();

  if (!orderId) {
    return NextResponse.json({ error: 'Missing order id' }, { status: 400 });
  }

  const isPaid = ['paid', 'approved', 'success', 'succeeded'].includes(status);

  const supabase = createSupabaseAdminClient();
  await supabase
    .from('orders')
    .update({
      status: isPaid ? 'paid' : 'pending_payment',
      payment_provider: 'meshulam'
    })
    .eq('id', orderId);

  return NextResponse.json({ received: true });
}
