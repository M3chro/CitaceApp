// components/QuoteCard.tsx
import { FontAwesome } from '@expo/vector-icons'; // Pro ikony
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Quote } from '../utils/api'; // Typ pro citaci
import { getResponsiveFontSize } from '../utils/uiHelpers'; // Helper pro velikost fontu

// Definice props, které komponenta očekává
interface QuoteCardProps {
  quote: Quote | null;                        // Objekt citace nebo null
  isFavorite: boolean;                      // Příznak, zda je citace aktuálně oblíbená
  onToggleFavorite: (quote: Quote) => void; // Funkce volaná při kliknutí na tlačítko oblíbených
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, isFavorite, onToggleFavorite }) => {
  const router = useRouter(); // Hook pro navigaci

  // Pokud nemáme data o citaci, komponenta nic nevykreslí
  if (!quote) {
    return null;
  }

  // Funkce pro sdílení citace
  const handleShare = async () => {
    if (!quote) return; // Pojistka, i když je kontrolováno výše
    try {
      const messageToShare = `"${quote.content}" - ${quote.author}`;
      await Share.share(
        {
          message: messageToShare,
          title: 'Podívej se na tuto citaci!', // Titulek pro sdílení (např. pro email)
        },
        {
          // Android only:
          dialogTitle: 'Sdílet citaci pomocí...',
          // iOS only (volitelné):
          // subject: 'Zajímavá citace',
        }
      );
      console.log('Citace úspěšně sdílena nebo dialog zrušen.');
    } catch (error: any) {
      Alert.alert('Chyba', 'Při sdílení citace nastala chyba.');
      console.error('Chyba při sdílení:', error.message);
    }
  };

  // Funkce pro zobrazení informací o autorovi
  const handleAuthorInfo = () => {
    if (quote && quote.author && quote.author !== 'Neznámý autor') {
      router.push({
        pathname: "/author/[authorName]", // Cesta k dynamické routě pro autora
        params: { authorName: encodeURIComponent(quote.author) }, // Předání jména autora
      });
    } else {
      // Můžeme zobrazit hlášku, nebo tlačítko vůbec nezobrazovat, pokud autor není znám
      Alert.alert('Informace o autorovi', 'Pro tohoto autora nejsou dostupné další informace.');
    }
  };

  // Funkce volaná při stisknutí tlačítka "Oblíbit/Oblíbená"
  const handleFavoritePress = () => {
    // Předpokládáme, že 'quote' zde určitě není null díky kontrole na začátku komponenty
    onToggleFavorite(quote!);
  };

  return (
    <View style={styles.quoteCard}>
      {/* Zobrazení textu citace */}
      <Text style={styles.quoteText}>{`"${quote.content}"`}</Text>
      {/* Zobrazení autora */}
      <Text style={styles.authorText}>- {quote.author}</Text>
      
      {/* Kontejner pro akční tlačítka */}
      <View style={styles.actionsContainer}>
        {/* Tlačítko Oblíbené */}
        <TouchableOpacity onPress={handleFavoritePress} style={styles.actionButton}>
          <FontAwesome 
            name={isFavorite ? "heart" : "heart-o"} // Ikona se mění podle stavu
            size={getResponsiveFontSize(20)} 
            color={isFavorite ? "#e91e63" : "#555"} // Barva ikony se mění
          />
          <Text style={[styles.actionButtonText, { color: isFavorite ? "#e91e63" : "#555" }]}>
            {isFavorite ? "Oblíbená" : "Oblíbit"}
          </Text>
        </TouchableOpacity>

        {/* Tlačítko Info o autorovi (zobrazí se, jen pokud je autor znám) */}
        {quote.author && quote.author !== 'Neznámý autor' && (
          <TouchableOpacity onPress={handleAuthorInfo} style={styles.actionButton}>
            <FontAwesome name="wikipedia-w" size={getResponsiveFontSize(20)} color="#555" />
            <Text style={styles.actionButtonText}>Autor</Text>
          </TouchableOpacity>
        )}

        {/* Tlačítko Sdílet */}
        <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
          <FontAwesome name="share-alt" size={getResponsiveFontSize(20)} color="#555" /> 
          <Text style={styles.actionButtonText}>Sdílet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styly pro komponentu QuoteCard
const styles = StyleSheet.create({
  quoteCard: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 25, // Horní padding
    paddingBottom: 15, // Menší spodní padding, protože actionsContainer má svůj paddingTop
    borderRadius: 12,
    width: '100%', // Přizpůsobí se šířce rodiče
    maxWidth: 500, // Maximální šířka karty
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    minHeight: 150, 
    justifyContent: 'space-between', // Rozloží obsah vertikálně
  },
  quoteText: {
    fontSize: getResponsiveFontSize(19),
    fontStyle: 'italic',
    color: '#34495e',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: getResponsiveFontSize(28),
  },
  authorText: {
    fontSize: getResponsiveFontSize(16),
    color: '#2c3e50',
    textAlign: 'right',
    fontWeight: '500',
    marginBottom: 20, // Odsazení od actionsContainer
  },
  actionsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0', // Světlejší oddělovací čára
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-around', // Rovnoměrné rozložení tlačítek
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'column', // Ikona nad textem pro úsporu místa
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    minWidth: 60, // Pro lepší klikatelnost
  },
  actionButtonText: {
    marginTop: 4, // Mezera mezi ikonou a textem
    fontSize: getResponsiveFontSize(11), // Menší text
    color: '#555', // Výchozí barva
  }
});

export default QuoteCard;