export const formatLogs = (logs: any[]) => {
    return logs
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(entry => {
        const timestamp = new Date(entry.timestamp).toLocaleString();
        const logContent = JSON.parse(entry.log).log.trim();
        return `[${timestamp}] ${logContent}`;
      })
      .join('\n');
  };