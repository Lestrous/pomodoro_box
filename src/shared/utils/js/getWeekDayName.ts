export function getWeekDayName(date: string) {
  const day = new Date(date).toLocaleDateString('ru', { weekday: 'long' });

  return day.charAt(0).toUpperCase() + day.slice(1);
}
