type MeshulamCustomer = {
  name: string;
  email: string;
  phone: string;
};

type MeshulamSessionArgs = {
  orderId: string;
  amount: number;
  customer: MeshulamCustomer;
  successUrl: string;
  cancelUrl: string;
  webhookUrl: string;
};

type MeshulamSession = {
  paymentUrl: string;
  reference?: string;
};

export function meshulamConfigured() {
  return Boolean(
    process.env.MESHULAM_API_URL &&
      process.env.MESHULAM_API_KEY &&
      process.env.MESHULAM_TERMINAL_ID
  );
}

export async function createMeshulamSession({
  orderId,
  amount,
  customer,
  successUrl,
  cancelUrl,
  webhookUrl
}: MeshulamSessionArgs): Promise<MeshulamSession | null> {
  if (!meshulamConfigured()) {
    return null;
  }

  const payload = {
    terminalId: process.env.MESHULAM_TERMINAL_ID,
    apiKey: process.env.MESHULAM_API_KEY,
    sum: amount,
    currency: 'ILS',
    transactionId: orderId,
    successUrl,
    cancelUrl,
    notifyUrl: webhookUrl,
    customer
  };

  const response = await fetch(process.env.MESHULAM_API_URL as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as Record<string, unknown>;
  const paymentUrl =
    (data.paymentUrl as string | undefined) ||
    (data.url as string | undefined) ||
    (data.payment_url as string | undefined);

  if (!paymentUrl) {
    return null;
  }

  return {
    paymentUrl,
    reference: (data.transactionId as string | undefined) || (data.reference as string | undefined)
  };
}
