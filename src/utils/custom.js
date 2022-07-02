export function formatNumber(amount) {
  return parseFloat(amount)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, "$&,");
}

export function getMonthName(month) {
  month = parseInt(month);
  if (month === 1) return "Enero";
  if (month === 2) return "Febrero";
  if (month === 3) return "Marzo";
  if (month === 4) return "Abril";
  if (month === 5) return "Mayo";
  if (month === 6) return "Junio";
  if (month === 7) return "Julio";
  if (month === 8) return "Agosto";
  if (month === 9) return "Septiembre";
  if (month === 10) return "Octubre";
  if (month === 11) return "Noviembre";
  if (month === 12) return "Diciembre";
}