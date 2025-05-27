import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Platform,
  ScrollView, StatusBar,
  StyleSheet,
  View
} from 'react-native';
import LanguageSelector from '../../components/LanguageSelector';
import QuoteCard from '../../components/QuoteCard';
import StatusDisplay from '../../components/StatusDisplay';
import { fetchRandomQuote, getAvailableLanguages, Language, Quote } from '../../utils/api';
import * as FavoritesStorage from '../../utils/storage';

/**
 * Hlavní obrazovka aplikace pro zobrazení náhodných citací.
 * Umožňuje výběr jazyka, označování oblíbených citací,
 * zobrazení informací o autorovi a sdílení citací.
 * Také spravuje stavy načítání, chyb a cooldown pro API požadavky.
 */
export default function HomeScreen() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<string>('cs');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isCurrentQuoteFavorite, setIsCurrentQuoteFavorite] = useState<boolean>(false);

  const [isCoolingDown, setIsCoolingDown] = useState<boolean>(false);
  const cooldownTimerRef = useRef<NodeJS.Timeout | number | null>(null);

  /**
   * Načte seznam dostupných jazyků při prvním vytvoření komponenty
   * a nastaví cleanup funkci pro případný běžící cooldown timer.
   */
  useEffect(() => {
    setLanguages(getAvailableLanguages());

    return () => {
      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current);
      }
    };
  }, []);

  /**
   * Kontroluje a nastavuje stav oblíbenosti pro aktuálně zobrazenou citaci.
   * Spouští se vždy, když se změní objekt `quote`.
   */
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

  /**
   * Hlavní funkce pro načtení náhodné citace z API.
   * Používá aktuálně zvolený jazyk. Spravuje stavy `isLoading`, `error`, `quote`
   * a také nastavuje cooldown po dokončení.
   * Je obalena v `useCallback` pro optimalizaci a správné fungování v závislostech `useEffect`.
   */
  const loadQuote = useCallback(async () => {
    console.log(`[UI TabsIndex] Načítám citaci pro jazyk: ${currentLanguage}`);
    setIsLoading(true);
    setError(null);
    setQuote(null);

    try {
      const fetchedQuote = await fetchRandomQuote(currentLanguage);
      setQuote(fetchedQuote);
    } catch (err: any) {
      console.error("[UI TabsIndex] Chyba při načítání citace:", err.message);
      setError(err.message || 'Nepodařilo se načíst citaci. Zkuste to prosím znovu.');
      setQuote(null);
    } finally {
      setIsLoading(false);
      setIsCoolingDown(true);
      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current);
      }
      cooldownTimerRef.current = setTimeout(() => {
        setIsCoolingDown(false);
        console.log('[UI TabsIndex] Cooldown pro tlačítko "Další citace" ukončen.');
      }, 1000); // Cooldown 1 sekunda (1000 ms)
    }
  }, [currentLanguage]);

  /**
   * Zajišťuje načtení citace při prvním renderu komponenty
   * a také při každé změně jazyka (díky závislosti na `loadQuote`, která závisí na `currentLanguage`).
   */
  useEffect(() => {
    loadQuote();
  }, [loadQuote]);


  /**
   * Handler pro stisknutí tlačítka "Další citace".
   * Spustí načtení nové citace, pokud neprobíhá jiné načítání nebo cooldown.
   */
  const handleRefresh = () => {
    if (isLoading || isCoolingDown) {
      if (isLoading) console.log('[UI TabsIndex] Načítání již probíhá, ignoruji kliknutí.');
      if (isCoolingDown) console.log('[UI TabsIndex] Tlačítko je v cooldownu, ignoruji kliknutí.');
      return;
    }
    loadQuote();
  };

  /**
   * Handler pro změnu jazyka v komponentě LanguageSelector.
   * Aktualizuje stav `currentLanguage`.
   * @param newLanguage Nově vybraný kód jazyka.
   */
  const handleLanguageChange = (newLanguage: string) => {
    if (isLoading || isCoolingDown) {
      console.log('[UI TabsIndex] Načítání/cooldown probíhá, změna jazyka bude mít efekt později nebo je ignorována.');
    }
    setCurrentLanguage(newLanguage);
  };

  /**
   * Handler pro přepnutí stavu oblíbenosti citace.
   * Přidá nebo odebere citaci z oblíbených v AsyncStorage a aktualizuje lokální stav.
   * @param quoteToToggle Objekt citace, u které se má změnit stav oblíbenosti.
   */
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

  /**
   * Pomocná funkce pro renderování hlavního obsahu obrazovky.
   * Zobrazuje buď QuoteCard s citací, nebo StatusDisplay (načítání, chyba, žádná data).
   * @returns {JSX.Element} Komponenta k zobrazení.
   */
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
        enabled={languages.length > 1 && !isLoading && !isCoolingDown} // Picker je neaktivní i během cooldownu a načítání
      />

      <View style={styles.contentArea}>
        {renderMainContent()}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Další citace"
          onPress={handleRefresh}
          disabled={isLoading || isCoolingDown} // Tlačítko je neaktivní i během cooldownu a načítání
          color="#2980b9"
        />
      </View>
    </ScrollView>
  );
}

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