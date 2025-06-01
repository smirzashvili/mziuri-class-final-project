export const capitalize = (text) => {
  return text[0].toUpperCase() + text.slice(1);
};

export const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const formatAge = (date) => {
  if (!date) return null;

  const birthDate = new Date(date);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return age;
};

export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  
  const day = String(date.getDate()).padStart(2, '0');  
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear();                         

  return `${day}/${month}/${year}`;
};

export const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now - date) / 1000);

  const units = [
    { label: 'y', seconds: 60 * 60 * 24 * 365 },
    { label: 'mo', seconds: 60 * 60 * 24 * 30 },
    { label: 'w', seconds: 60 * 60 * 24 * 7 },
    { label: 'd', seconds: 60 * 60 * 24 },
    { label: 'h', seconds: 60 * 60 },
    { label: 'm', seconds: 60 },
  ];

  for (const unit of units) {
    const value = Math.floor(seconds / unit.seconds);
    if (value >= 1) {
      return `${value}${unit.label}`;
    }
  }

  return 'now'; // Less than 1 minute ago
};
