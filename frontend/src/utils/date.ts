export const formatDate = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  
  const options: Intl.DateTimeFormatOptions = { 
    month: 'long', 
    day: 'numeric', 
    weekday: 'short' 
  };
  
  if (end) {
    const startText = start.toLocaleDateString('ko-KR', options);
    const endText = end.toLocaleDateString('ko-KR', options);
    return `${startText} ~ ${endText}`;
  }
  return start.toLocaleDateString('ko-KR', options);
};

export const formatDateCompact = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  
  const m1 = start.getMonth() + 1;
  const d1 = start.getDate();
  
  if (end) {
    const m2 = end.getMonth() + 1;
    const d2 = end.getDate();
    return `${m1}.${d1} - ${m2}.${d2}`;
  }
  return `${m1}.${d1}`;
};

export const getStatus = (startDate: string, endDate: string) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : start;
  
  if (now >= start && now <= end) {
    return { text: '진행중', color: 'bg-green-500', textColor: 'text-green-600' };
  }
  
  if (now < start) {
    const diffTime = start.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) {
      return { text: `D-${diffDays}`, color: 'bg-orange-500', textColor: 'text-orange-600' };
    }
    return { text: '예정', color: 'bg-blue-500', textColor: 'text-blue-600' };
  }
  
  return { text: '종료', color: 'bg-gray-400', textColor: 'text-gray-600' };
};
