
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  CHARACTER: '@dnd_character',
  INVENTORY: '@dnd_inventory',
  JOURNAL: '@dnd_journal',
  CHARACTER_IMAGE: '@dnd_character_image',
};

export const storage = {
  // Character data
  async saveCharacter(data: any) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CHARACTER, JSON.stringify(data));
      console.log('Character data saved successfully');
    } catch (error) {
      console.error('Error saving character data:', error);
    }
  },

  async loadCharacter() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CHARACTER);
      if (data) {
        console.log('Character data loaded successfully');
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error('Error loading character data:', error);
      return null;
    }
  },

  // Inventory data
  async saveInventory(items: any[]) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(items));
      console.log('Inventory saved successfully');
    } catch (error) {
      console.error('Error saving inventory:', error);
    }
  },

  async loadInventory() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.INVENTORY);
      if (data) {
        console.log('Inventory loaded successfully');
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error('Error loading inventory:', error);
      return null;
    }
  },

  // Journal data
  async saveJournal(entries: any[]) {
    try {
      const serializedEntries = entries.map(entry => ({
        ...entry,
        date: entry.date.toISOString(),
      }));
      await AsyncStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(serializedEntries));
      console.log('Journal saved successfully');
    } catch (error) {
      console.error('Error saving journal:', error);
    }
  },

  async loadJournal() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.JOURNAL);
      if (data) {
        const entries = JSON.parse(data);
        const deserializedEntries = entries.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
        }));
        console.log('Journal loaded successfully');
        return deserializedEntries;
      }
      return null;
    } catch (error) {
      console.error('Error loading journal:', error);
      return null;
    }
  },

  // Character image settings
  async saveCharacterImage(imageData: any) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CHARACTER_IMAGE, JSON.stringify(imageData));
      console.log('Character image settings saved successfully');
    } catch (error) {
      console.error('Error saving character image settings:', error);
    }
  },

  async loadCharacterImage() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CHARACTER_IMAGE);
      if (data) {
        console.log('Character image settings loaded successfully');
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error('Error loading character image settings:', error);
      return null;
    }
  },

  // Clear all data
  async clearAll() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.CHARACTER,
        STORAGE_KEYS.INVENTORY,
        STORAGE_KEYS.JOURNAL,
        STORAGE_KEYS.CHARACTER_IMAGE,
      ]);
      console.log('All data cleared successfully');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  },
};
