import secureLocalStorage from "react-secure-storage";

const updateLocalStorage = (key: string, value: Object) => {
  const currentData = secureLocalStorage.getItem(key) as string;
  const cacheData = currentData ? JSON.parse(currentData) : {};

  secureLocalStorage.setItem(
    key,
    JSON.stringify({
      ...cacheData,
      ...value,
    })
  );
};

export default updateLocalStorage;
