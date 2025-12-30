import { AppointmentStatus } from '../common/enums/appointment-status.enum';

export function isValidStatusTransition(
  current: AppointmentStatus,
  next: AppointmentStatus,
): boolean {
  const transitions: Record<AppointmentStatus, AppointmentStatus[]> = {
    [AppointmentStatus.SCHEDULED]: [
      AppointmentStatus.CONFIRMED,
      AppointmentStatus.CANCELLED,
    ],
    [AppointmentStatus.CONFIRMED]: [
      AppointmentStatus.COMPLETED,
      AppointmentStatus.CANCELLED,
    ],
    [AppointmentStatus.COMPLETED]: [],
    [AppointmentStatus.CANCELLED]: [],
  };

  return transitions[current]?.includes(next) ?? false;
}