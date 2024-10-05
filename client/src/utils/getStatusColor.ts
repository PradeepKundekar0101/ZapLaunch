export const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
      case 'DEPLOYED': return 'text-green-500';
      case 'FAILED': return 'text-red-500';
      case 'REMOVED': return 'text-gray-500';
      case 'STARTED' || "IN_PROGRESS": return 'text-yellow-500';
      default: return 'text-blue-500';
    }
  };