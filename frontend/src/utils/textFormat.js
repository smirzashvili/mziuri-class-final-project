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