import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native';
import QuoteCard from '../../components/QuoteCard';
import { Quote } from '../../utils/api';
import * as FavoritesStorage from '../../utils/storage';

/**
 * Obrazovka `FavoritesScreen` zobrazuje seznam citací, které si uživatel označil jako oblíbené.
 * Umožňuje také odebrání citací z tohoto seznamu.
 * Data se načítají z lokálního AsyncStorage při každém zaměření (focus) obrazovky.
 */
export default function FavoritesScreen() {
  const [favoriteQuotes, setFavoriteQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Asynchronní funkce pro načtení seznamu oblíbených citací z AsyncStorage.
   * Aktualizuje stavy `favoriteQuotes` a `isLoading`.
   * Obaleno v `useCallback` pro stabilní referenci v `useFocusEffect`.
   */
  const loadFavorites = useCallback(async () => {
    setIsLoading(true);
    try {
      const favs = await FavoritesStorage.getFavorites();
      setFavoriteQuotes(favs);
      console.log(`[UI Favorites] Načteno ${favs.length} oblíbených citací.`);
    } catch (error) {
      console.error("[UI Favorites] Chyba při načítání oblíbených:", error);
      Alert.alert("Chyba", "Nepodařilo se načíst oblíbené citace.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * `useEffect` hook, který se spouští vždy, když se obrazovka stane aktivní (dostane focus).
   * Zajišťuje, že seznam oblíbených citací je vždy aktuální.
   */
  useFocusEffect(
    useCallback(() => {
      console.log("[UI Favorites] Obrazovka zaměřena, načítám oblíbené...");
      loadFavorites();
      return () => {
        console.log("[UI Favorites] Obrazovka opuštěna.");
      };
    }, [loadFavorites])
  );

  /**
   * Handler pro odebrání citace ze seznamu oblíbených.
   * Zobrazí potvrzovací dialog a po potvrzení odebere citaci a obnoví seznam.
   * @param quoteToRemove Objekt citace typu {@link Quote}, která má být odebrána.
   */
  const handleToggleFavoriteOnFavoritesScreen = async (quoteToRemove: Quote) => {
    Alert.alert(
      "Odebrat z oblíbených",
      `Opravdu si přejete odebrat citaci "${quoteToRemove.content.substring(0, 30)}..." z oblíbených?`,
      [
        { text: "Zrušit", style: "cancel" },
        {
          text: "Odebrat",
          style: "destructive",
          onPress: async () => {
            try {
              await FavoritesStorage.removeFavorite(quoteToRemove.id);
              loadFavorites(); 
              console.log(`[UI Favorites] Citace ${quoteToRemove.id} odebrána z oblíbených.`);
            } catch (error) {
              console.error("[UI Favorites] Chyba při odebírání oblíbené:", error);
              Alert.alert("Chyba", "Nepodařilo se odebrat citaci z oblíbených.");
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
        <View style={styles.centeredMessage}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Načítám oblíbené citace...</Text>
        </View>
    );
  }

  if (favoriteQuotes.length === 0) {
    return (
      <View style={styles.centeredMessage}>
        <Text style={styles.emptyText}>Zatím nemáte žádné oblíbené citace.</Text>
        <Text style={styles.emptySubText}>Označte nějakou citaci srdíčkem na hlavní obrazovce!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favoriteQuotes}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.quoteItemContainer}>
          <QuoteCard
            quote={item}
            isFavorite={true}
            onToggleFavorite={() => handleToggleFavoriteOnFavoritesScreen(item)}
          />
        </View>
      )}
      contentContainerStyle={styles.listContentContainer}
    />
  );
}

const styles = StyleSheet.create({
  listContentContainer: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  quoteItemContainer: {
    marginBottom: 15,
  },
  centeredMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  emptyText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});