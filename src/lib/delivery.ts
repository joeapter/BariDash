export function calculateDeliveryEta(createdAt: Date, hours = 5) {
  const cutoffHour = 17;
  const created = new Date(createdAt);

  if (created.getHours() >= cutoffHour) {
    const nextDay = new Date(created);
    nextDay.setDate(created.getDate() + 1);
    nextDay.setHours(10, 0, 0, 0);
    return nextDay;
  }

  const eta = new Date(created);
  eta.setHours(created.getHours() + hours);
  return eta;
}
