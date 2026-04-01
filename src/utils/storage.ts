// Utility to interact with localStorage while simulating async API delays
export const simulateDelay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

export const getStorageData = async <T>(key: string, defaultValue: T): Promise<T> => {
  await simulateDelay();
  const data = localStorage.getItem(key);
  if (!data) {
    // If not exists, save the default value immediately synchronously to establish initial state
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const setStorageData = async <T>(key: string, value: T): Promise<void> => {
  await simulateDelay();
  localStorage.setItem(key, JSON.stringify(value));
};
