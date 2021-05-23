export const get = async (url) => {
  const resp = await fetch(url).catch((error) => console.error(error));

  return resp.json();
};
