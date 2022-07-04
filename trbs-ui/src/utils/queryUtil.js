export const extractQueryParams = (queryString) => {
  let params = {};
  for (let param of queryString.split("&")) {
    let key = param.split("=")[0];
    let value = param.split("=")[1];
    params[key] = value;
  }
  return params;
};
