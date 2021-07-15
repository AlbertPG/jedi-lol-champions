const get = async (url, onError = () => {}) => {
  try {
    return (await axios.get(url)).data;
  } catch (error) {
    console.error(error);
    onError(error);
  }
};

const post = async (url, body, onError = () => {}) => {
  try {
    return (await axios.post(url, body)).data;
  } catch (error) {
    console.error(error);
    onError(error);
  }
};

const put = async (url, body, onError = () => {}) => {
  try {
    return (await axios.put(url, body)).data;
  } catch (error) {
    console.error(error);
    onError(error);
  }
};
