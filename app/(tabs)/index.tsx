// app/(tabs)/index.tsx
import { useRouter } from 'expo-router'; // Stále může být potřeba pro jinou navigaci, i když ne pro /favorites
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Platform,
  ScrollView, StatusBar,
  StyleSheet,
  View
} from 'react-native';

// Upravené cesty k importům (o úroveň výše)
import LanguageSelector from '../../components/LanguageSelector';
import QuoteCard from '../../components/QuoteCard';
import StatusDisplay from '../../components/StatusDisplay';
import { fetchRandomQuote, getAvailableLanguages, Language, Quote } from '../../utils/api';
import * as FavoritesStorage from '../../utils/storage';

// Hlavní komponenta obrazovky - nyní bez explicitního návratového typu JSX.Element
export default function HomeScreen() {
  const router = useRouter(); // Ponecháváme pro případné další navigace z této obrazovky
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<string>('cs');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isCurrentQuoteFavorite, setIsCurrentQuoteFavorite] = useState<boolean>(false);

  useEffect(() => {
    setLanguages(getAvailableLanguages());
  }, []);

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (quote) {
        const favoriteStatus = await FavoritesStorage.isFavorite(quote.id);
        setIsCurrentQuoteFavorite(favoriteStatus);
        console.log(`[UI TabsIndex] Citace ${quote.id} je oblíbená: ${favoriteStatus}`);
      } else {
        setIsCurrentQuoteFavorite(false);
      }
    };
    checkIfFavorite();
  }, [quote]);

  const loadQuote = useCallback(async () => {
    console.log(`[UI TabsIndex] Načítám citaci pro jazyk: ${currentLanguage}`);
    setIsLoading(true);
    setError(null);
    // setQuote(null); // Reset až po fetchi
    try {
      const fetchedQuote = await fetchRandomQuote(currentLanguage);
      setQuote(fetchedQuote);
    } catch (err: any) {
      console.error("[UI TabsIndex] Chyba při načítání citace:", err.message);
      setError(err.message || 'Nepodařilo se načíst citaci.');
      setQuote(null);
    } finally {
      setIsLoading(false);
    }
  }, [currentLanguage]);

  useEffect(() => {
    loadQuote();
  }, [loadQuote]); // Spustí se při prvním renderu a když se změní currentLanguage (což změní referenci loadQuote)

  const handleRefresh = () => {
    loadQuote();
  };

  const handleLanguageChange = (newLanguage: string) => {
    setCurrentLanguage(newLanguage);
    // loadQuote se zavolá automaticky díky useEffect, který sleduje změnu currentLanguage
  };

  const handleToggleFavorite = async (quoteToToggle: Quote) => {
    if (!quoteToToggle) return;
    const currentStatus = await FavoritesStorage.isFavorite(quoteToToggle.id);
    try {
      if (currentStatus) {
        await FavoritesStorage.removeFavorite(quoteToToggle.id);
        setIsCurrentQuoteFavorite(false);
        console.log('[UI TabsIndex] Odebráno z oblíbených:', quoteToToggle.id);
      } else {
        await FavoritesStorage.addFavorite(quoteToToggle);
        setIsCurrentQuoteFavorite(true);
        console.log('[UI TabsIndex] Přidáno do oblíbených:', quoteToToggle.id);
      }
    } catch (e) {
      console.error("[UI TabsIndex] Chyba při změně stavu oblíbenosti:", e);
      Alert.alert("Chyba", "Nepodařilo se uložit změnu oblíbenosti.");
    }
  };

  const renderMainContent = () => {
    if (!isLoading && !error && quote) {
      return (
        <QuoteCard
          quote={quote}
          isFavorite={isCurrentQuoteFavorite}
          onToggleFavorite={handleToggleFavorite}
        />
      );
    }
    return (
      <StatusDisplay
        isLoading={isLoading}
        error={error}
        hasData={!!quote}
        onRetry={handleRefresh}
        loadingText="Načítám vaši denní dávku inspirace..."
        noDataText="Pro zvolený jazyk momentálně není k dispozici žádná citace."
      />
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} />

      <LanguageSelector
        label="Vyberte jazyk citací:"
        selectedValue={currentLanguage}
        onValueChange={handleLanguageChange}
        languages={languages}
        enabled={languages.length > 1 && !isLoading}
      />

      <View style={styles.contentArea}>
        {renderMainContent()}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Další citace"
          onPress={handleRefresh}
          disabled={isLoading}
          color="#2980b9"
        />
        {/* Tlačítko "Zobrazit oblíbené" bylo ODSTRANĚNO - navigace je nyní přes taby */}
      </View>
    </ScrollView>
  );
}

// Styly zůstávají stejné jako v poslední verzi app/index.tsx před přesunem
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#f4f6f8',
  },
  contentArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  buttonContainer: {
    width: '80%',
    maxWidth: 300,
    marginTop: 15,
    paddingBottom: 10,
  },
});