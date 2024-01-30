export const getProductImage = (image) => {
  return `http://localhost:8080/api/product/images/${image}`;
};

export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};
