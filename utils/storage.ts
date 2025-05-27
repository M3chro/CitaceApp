import AsyncStorage from '@react-native-async-storage/async-storage';
import { Quote } from './api';

const FAVORITES_KEY = '@FavoriteQuotes_App';

/**
 * Načte všechny oblíbené citace z AsyncStorage.
 * @returns Promise, která se resolvuje na pole objektů {@link Quote}.
 */
export const getFavorites = async (): Promise<Quote[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('[Storage] Chyba při načítání oblíbených:', e);
    return [];
  }
};

/**
 * Přidá citaci do seznamu oblíbených.
 * @param quote Objekt citace typu {@link Quote}, která má být přidána.
 * @returns Promise, která se resolvuje, když je operace dokončena.
 */
export const addFavorite = async (quoteToAdd: Quote): Promise<void> => {
  try {
    const currentFavorites = await getFavorites();
    if (!currentFavorites.find(q => q.id === quoteToAdd.id)) {
      const newFavorites = [...currentFavorites, quoteToAdd];
      const jsonValue = JSON.stringify(newFavorites);
      await AsyncStorage.setItem(FAVORITES_KEY, jsonValue);
      console.log('[Storage] Citace přidána do oblíbených:', quoteToAdd.id);
    } else {
      console.log('[Storage] Citace již je v oblíbených:', quoteToAdd.id);
    }
  } catch (e) {
    console.error('[Storage] Chyba při přidávání do oblíbených:', e);
  }
};

/**
 * Odebere citaci ze seznamu oblíbených podle jejího ID.
 * @param quoteId ID citace (string), která má být odebrána.
 * @returns Promise, která se resolvuje, když je operace dokončena.
 */
export const removeFavorite = async (quoteIdToRemove: string): Promise<void> => {
  try {
    const currentFavorites = await getFavorites();
    const newFavorites = currentFavorites.filter(quote => quote.id !== quoteIdToRemove);
    const jsonValue = JSON.stringify(newFavorites);
    await AsyncStorage.setItem(FAVORITES_KEY, jsonValue);
    console.log('[Storage] Citace odebrána z oblíbených:', quoteIdToRemove);
  } catch (e) {
    console.error('[Storage] Chyba při odebírání z oblíbených:', e);
  }
};

/**
 * Zkontroluje, zda je citace s daným ID v oblíbených.
 * @param quoteId ID citace (string) k ověření.
 * @returns Promise, která se resolvuje na boolean (true, pokud je oblíbená, jinak false).
 */
export const isFavorite = async (quoteIdToCheck: string): Promise<boolean> => {
  try {
    const currentFavorites = await getFavorites();
    return !!currentFavorites.find(quote => quote.id === quoteIdToCheck);
  } catch (e) {
    console.error('[Storage] Chyba při kontrole oblíbenosti:', e);
    return false;
  }
};