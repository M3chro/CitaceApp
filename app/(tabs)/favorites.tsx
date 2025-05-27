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

export default function FavoritesScreen() {
  const [favoriteQuotes, setFavoriteQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  useFocusEffect(
    useCallback(() => {
      console.log("[UI Favorites] Obrazovka zaměřena, načítám oblíbené...");
      loadFavorites();
      return () => {
        console.log("[UI Favorites] Obrazovka opuštěna.");
      };
    }, [loadFavorites])
  );

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