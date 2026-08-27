const MONTHS_AZ = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "İyun",
  "İyul",
  "Avqust",
  "Sentyabr",
  "Oktyabr",
  "Noyabr",
  "Dekabr",
];

export function formatDateAz(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const monthName = MONTHS_AZ[month - 1] ?? "";
  return `${day} ${monthName} ${year}`;
}
