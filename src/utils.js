export function formatDate(value) {
  const [, month, day] = value.split("-");
  return `${Number(month)}/${Number(day)}`;
}

export function formatClock(value) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  }).format(value);
}
