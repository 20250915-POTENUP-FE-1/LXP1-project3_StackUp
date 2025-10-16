export const makeId = () => {
  const today = new Date();
  const year = String(today.getFullYear());
  const month = String(today.getMonth() + 1);
  const date = String(today.getDate());
  const hours = String(today.getHours());
  const minutes = String(today.getMinutes());
  const seconds = String(today.getSeconds());
  const idString = year + month + date + hours + minutes + seconds;
  return idString;
};
