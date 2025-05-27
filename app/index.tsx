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
  const [currentLanguage, setCurrentLanguage] = useState<string>('cs');
  const [languages, setLanguages] = useState<Language[]>([]);

  useEffect(() => {
    setLanguages(getAvailableLanguages());
  }, []);

  const loadQuote = useCallback(async () => {
    console.log(`[UI] Načítám citaci pro jazyk: ${currentLanguage}`);
    setIsLoading(true);
    setError(null);
    setQuote(null);
    try {
      const fetchedQuote = await fetchRandomQuote(currentLanguage);
      setQuote(fetchedQuote);
    } catch (err: any) {
      console.error("[UI] Chyba při načítání citace:", err.message);
      setError(err.message || 'Nepodařilo se načíst citaci. Zkuste to prosím znovu.');
    } finally {
      setIsLoading(false);
    }
  }, [currentLanguage]);

  useEffect(() => {
    loadQuote();
  }, [loadQuote]);

  const handleRefresh = () => {
    loadQuote();
  };

  const handleLanguageChange = (newLanguage: string) => {
    setCurrentLanguage(newLanguage);
    console.log("Nově zvolený jazyk v UI:", newLanguage);
  };

  const renderMainContent = () => {
    if (!isLoading && !error && quote) {
      return <QuoteCard quote={quote} />;
    }
    return (
      <StatusDisplay
        isLoading={isLoading}
        error={error}
        hasData={!!quote}
        onRetry={handleRefresh}
        loadingText="Načítám vaši denní dávku inspirace..."
        noDataText="Pro zvolený jazyk momentálně není k dispozici žádná citace. Zkuste jiný jazyk nebo to zkuste později." // Upravený text
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