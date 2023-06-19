export function getCurrentDayIndex() {
  const currentDayIndex = new Date().getDay();

  return currentDayIndex === 0 ? 6 : currentDayIndex - 1;
}
