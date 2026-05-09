export function getDaysLeft(dateString) {
  if (!dateString) return null;

  const today = new Date();
  const endDate = new Date(dateString);

  const diffTime = endDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}