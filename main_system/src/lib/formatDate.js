export default (date) => {
  let tem = new Date(date);
  return `${tem.getMonth()}/${tem.getDate()}`;
};
