
/**
 * Helper functions for storing and retrieving data from localStorage
 */

// Function to save data to localStorage
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Function to load data from localStorage with proper type conversion
export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const savedData = localStorage.getItem(key);
    if (!savedData) {
      return defaultValue;
    }
    
    return JSON.parse(savedData);
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Parse date strings back to Date objects in complex objects
export const parseDates = <T>(data: T[], dateFields: string[]): T[] => {
  return data.map(item => {
    const newItem = { ...item };
    dateFields.forEach(field => {
      if (newItem[field as keyof T]) {
        newItem[field as keyof T] = new Date(newItem[field as keyof T] as unknown as string) as any;
      }
    });
    return newItem;
  });
};

// Storage keys
export const STORAGE_KEYS = {
  CUSTOMERS: 'salon-app-customers',
  SERVICES: 'salon-app-services',
  STAFF: 'salon-app-staff'
};
