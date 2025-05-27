import React from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { getResponsiveFontSize } from '../utils/uiHelpers';

/**
 * Props pro komponentu StatusDisplay.
 */
interface StatusDisplayProps {
  isLoading: boolean;
  error: string | null;
  hasData: boolean;
  onRetry?: () => void;
  loadingText?: string;
  noDataText?: string;
}

/**
 * Komponenta `StatusDisplay` slouží k zobrazení různých stavových zpráv uživateli,
 * jako je indikátor načítání, chybová hláška s možností opakování akce,
 * nebo zpráva o tom, že nejsou k dispozici žádná data.
 * @param {StatusDisplayProps} props - Props pro komponentu.
 * @returns {JSX.Element | null} Element komponenty zobrazující příslušný stav, nebo null, pokud má být zobrazen hlavní obsah.
 */
const StatusDisplay: React.FC<StatusDisplayProps> = ({
  isLoading,
  error,
  hasData,
  onRetry,
  loadingText = "Načítám inspiraci...",
  noDataText = "Žádná data k zobrazení.",
}) => {
  if (isLoading) {
    return (
      <View style={styles.centeredContent}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.statusText}>{loadingText}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContent}>
        <Text style={styles.errorText}>{error}</Text>
        {onRetry && (
          <>
            <View style={styles.buttonSpacer} />
            <Button title="Zkusit znovu" onPress={onRetry} color="#3498db" />
          </>
        )}
      </View>
    );
  }

  if (!hasData) {
    // Tento stav se zobrazí, pokud není loading, není chyba, ale nejsou ani data
    return (
      <View style={styles.centeredContent}>
        <Text style={styles.statusText}>{noDataText}</Text>
        {onRetry && (
             <>
                <View style={styles.buttonSpacer} />
                <Button title="Načíst znovu" onPress={onRetry} color="#3498db" />
             </>
        )}
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  centeredContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    minHeight: 150,
  },
  statusText: {
    fontSize: getResponsiveFontSize(16),
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: getResponsiveFontSize(16),
    color: '#e74c3c',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 10,
  },
  buttonSpacer: {
    height: 15,
  },
});

export default StatusDisplay;