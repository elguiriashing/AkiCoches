export type RentalBlock = {
  vehicle_id: string;
  start_date: string;
  end_date: string;
};
export function rentalRangeBlocked(
  blocks: RentalBlock[],
  vehicleId: string,
  start: string,
  end: string,
) {
  return blocks.some(
    (b) =>
      b.vehicle_id === vehicleId && b.start_date < end && b.end_date > start,
  );
}
export function calendarDate(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month, day)).toISOString().slice(0, 10);
}
