/**
 * Utility function untuk format waktu
 * Format: "HH:MM:SS" atau "HH:MM:SS, DD MMM YYYY"
 */

export function formatTimestamp(date: Date | null, includeDate: boolean = false): string {
  if (!date) return 'Belum pernah diperbarui';

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const time = `${hours}:${minutes}:${seconds}`;

  if (!includeDate) return time;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${time}, ${day} ${month} ${year}`;
}

/**
 * Utility function untuk menghitung selisih waktu dari sekarang
 * Return: "baru saja", "5 menit lalu", "1 jam lalu", dll
 */
export function getTimeAgo(date: Date | null): string {
  if (!date) return 'Belum pernah';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 30) return `${diffDays} hari lalu`;

  return formatTimestamp(date, true);
}
