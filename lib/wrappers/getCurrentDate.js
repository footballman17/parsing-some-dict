const getCurrentDate = () => {
  const date = new Date();
  return `${date.getFullYear()}_${date.getMonth() +
    1}_${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
};

module.exports = getCurrentDate;
