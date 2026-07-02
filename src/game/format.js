export function formatNum(n) {
  if (n === Infinity) return '∞';
  if (n < 0) return '-' + formatNum(-n);
  n = Math.floor(n);
  if (n < 1000) return n.toString();
  const units = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
  let tier = Math.floor(Math.log10(n) / 3);
  tier = Math.min(tier, units.length - 1);
  return (n / Math.pow(1000, tier)).toFixed(2) + units[tier];
}

export function formatUsd(n) {
  return '$' + formatNum(n);
}