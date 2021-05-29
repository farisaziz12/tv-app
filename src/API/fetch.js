export const get = async (url) => {
  try {
    const resp = await fetch(url).catch((error) => console.error(error));

    return resp.json();
  } catch (error) {
    console.error(error);
  }
};
