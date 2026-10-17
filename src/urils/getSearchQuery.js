const generateSearchQuery = (values) => {
  let queryString = "&";

  for (const key in values) {
    if (values[key]) queryString = queryString + key + "=" + values[key] + "&";
  }

  return queryString;
};

export { generateSearchQuery };
