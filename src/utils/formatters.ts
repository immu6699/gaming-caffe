// Formatters for Currency, Dates, and Time intervals

export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDateTime = (isoString?: string): string => {
  if (!isoString) return '--';
  const date = new Date(isoString);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatDateOnly = (dateString?: string): string => {
  if (!dateString) return '--';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatTimeOnly = (timeString?: string): string => {
  if (!timeString) return '--';
  if (timeString.includes(':') && timeString.length <= 5) {
    const [h, m] = timeString.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${m} ${ampm}`;
  }
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const getElapsedDuration = (startTimeIso: string, endTimeIso?: string): {
  elapsedText: string;
  elapsedMinutes: number;
  remainingText: string;
  remainingMinutes: number;
  isOverdue: boolean;
} => {
  const start = new Date(startTimeIso).getTime();
  const now = Date.now();
  const elapsedMs = Math.max(0, now - start);
  const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));

  const hours = Math.floor(elapsedMinutes / 60);
  const mins = elapsedMinutes % 60;
  const elapsedText = `${hours > 0 ? `${hours}h ` : ''}${mins}m`;

  let remainingText = '--';
  let remainingMinutes = 0;
  let isOverdue = false;

  if (endTimeIso) {
    const end = new Date(endTimeIso).getTime();
    const remainingMs = end - now;
    remainingMinutes = Math.round(remainingMs / (1000 * 60));
    if (remainingMinutes <= 0) {
      isOverdue = true;
      const overdueMins = Math.abs(remainingMinutes);
      const oHours = Math.floor(overdueMins / 60);
      const oMins = overdueMins % 60;
      remainingText = `Overdue by ${oHours > 0 ? `${oHours}h ` : ''}${oMins}m`;
    } else {
      const rHours = Math.floor(remainingMinutes / 60);
      const rMins = remainingMinutes % 60;
      remainingText = `${rHours > 0 ? `${rHours}h ` : ''}${rMins}m left`;
    }
  }

  return { elapsedText, elapsedMinutes, remainingText, remainingMinutes, isOverdue };
};
