export const THAI_MONTHS: Record<string, number> = {
  'มกราคม': 0, 'กุมภาพันธ์': 1, 'มีนาคม': 2, 'เมษายน': 3, 'พฤษภาคม': 4, 'มิถุนายน': 5,
  'กรกฎาคม': 6, 'สิงหาคม': 7, 'กันยายน': 8, 'ตุลาคม': 9, 'พฤศจิกายน': 10, 'ธันวาคม': 11
};

export function parseThaiDate(dateStr: string): number {
  if (!dateStr) return 0;
  const parts = dateStr.split(' ');
  if (parts.length < 3) return 0;
  const day = parseInt(parts[0]);
  const month = THAI_MONTHS[parts[1]] || 0;
  const year = parseInt(parts[2]);
  // Convert Buddhist Era (B.E.) to Common Era (C.E.) for JavaScript Date
  return new Date(year - 543, month, day).getTime();
}
