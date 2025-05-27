import React, { useCallback, useEffect, useState } from 'react';
import {
    Button,
    Platform,
    ScrollView, StatusBar,
    StyleSheet,
    View
} from 'react-native';
import LanguageSelector from '../components/LanguageSelector';
import QuoteCard from '../components/QuoteCard';
import StatusDisplay from '../components/StatusDisplay';
import { fetchRandomQuote, getAvailableLanguages, Language, Quote } from '../utils/api';

export default function HomeScreen() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [languages, setLanguages] = useState<Language[]>([]);

  useEffect(() => {
    setLanguages(getAvailableLanguages());
  }, []);

  const loadQuote = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setQuote(null);
    try {
      const fetchedQuote = await fetchRandomQuote();
      setQuote(fetchedQuote);
    } catch (err: any) {
      console.error("[UI] Chyba při načítání citace:", err.message);
      setError(err.message || 'Nepodařilo se načíst citaci.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuote();
  }, [loadQuote]);

  const handleRefresh = () => {
    loadQuote();
  };

  const handleLanguageChange = (newLanguage: string) => {
    setCurrentLanguage(newLanguage);
    console.log("Nově zvolený jazyk v UI (bez efektu na data):", newLanguage);
  };

  const renderMainContent = () => {
    if (!isLoading && !error && quote) {
      return <QuoteCard quote={quote} />;
    }

    return (
      <StatusDisplay
        isLoading={isLoading}
        error={error}
        hasData={!!quote} // true pokud quote existuje, jinak false
        onRetry={handleRefresh}
        loadingText="Načítám vaši denní dávku inspirace..."
        noDataText="Momentálně není k dispozici žádná citace. Zkuste to prosím později."
      />
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} />

      <LanguageSelector
        label="Jazyk citací:"
        selectedValue={currentLanguage}
        onValueChange={handleLanguageChange}
        languages={languages}
        enabled={languages.length > 1}
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