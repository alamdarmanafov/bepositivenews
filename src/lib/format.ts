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

const WEEKDAYS_AZ = [
  "Bazar",
  "Bazar ertəsi",
  "Çərşənbə axşamı",
  "Çərşənbə",
  "Cümə axşamı",
  "Cümə",
  "Şənbə",
];

export function formatDateAz(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const monthName = MONTHS_AZ[month - 1] ?? "";
  return `${day} ${monthName} ${year}`;
}

export function formatFullDateAz(date: Date): string {
  const weekday = WEEKDAYS_AZ[date.getDay()];
  const day = date.getDate();
  const monthName = MONTHS_AZ[date.getMonth()];
  const year = date.getFullYear();
  return `${weekday}, ${day} ${monthName} ${year}`;
}
