export const get = async (url, entryPoint) => {
  try {
    const resp = await fetch(url).catch((error) => console.error(error));

    if (entryPoint) {
      const data = await resp.json();
      return data[entryPoint];
    } else {
      return resp.json();
    }
  } catch (error) {
    console.error(error);
  }
};
