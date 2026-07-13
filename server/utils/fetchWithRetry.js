const fetchWithRetry = async (url, retries = 2) => {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url);
      return response;
    } catch (err) {
      if (i === retries) throw err;
      await new Promise((r) => setTimeout(r, 300 * (i + 1)));
    }
  }
};

export default fetchWithRetry;
