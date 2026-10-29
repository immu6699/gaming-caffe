// Export utility for real CSV and JSON downloads

export const exportToCSV = <T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: { key: keyof T; label: string }[]
) => {
  if (!data || !data.length) {
    alert('No data available to export.');
    return;
  }

  let csvContent = '';

  if (headers && headers.length) {
    csvContent += headers.map(h => `"${h.label}"`).join(',') + '\r\n';
    data.forEach(item => {
      const row = headers.map(h => {
        const val = item[h.key];
        if (val === null || val === undefined) return '""';
        if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      csvContent += row.join(',') + '\r\n';
    });
  } else {
    const keys = Object.keys(data[0]);
    csvContent += keys.map(k => `"${k}"`).join(',') + '\r\n';
    data.forEach(item => {
      const row = keys.map(k => {
        const val = item[k];
        if (val === null || val === undefined) return '""';
        if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      csvContent += row.join(',') + '\r\n';
    });
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToJSON = (data: any, filename: string) => {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};
