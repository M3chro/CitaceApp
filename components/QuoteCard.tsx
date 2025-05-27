import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Quote } from '../utils/api';
import { getResponsiveFontSize } from '../utils/uiHelpers';

interface QuoteCardProps {
  quote: Quote | null;
  isFavorite: boolean;
  onToggleFavorite: (quote: Quote) => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, isFavorite, onToggleFavorite }) => {
  const router = useRouter();

  if (!quote) {
    return null;
  }

  const handleShare = async () => {
    if (!quote) return;
    try {
      const messageToShare = `"${quote.content}" - ${quote.author}`;
      await Share.share(
        {
          message: messageToShare,
          title: 'Podívej se na tuto citaci!',
        },
        {
          // Android only:
          dialogTitle: 'Sdílet citaci pomocí...',
          // iOS only:
          subject: 'Zajímavá citace',
        }
      );
      console.log('Citace úspěšně sdílena nebo dialog zrušen.');
    } catch (error: any) {
      Alert.alert('Chyba', 'Při sdílení citace nastala chyba.');
      console.error('Chyba při sdílení:', error.message);
    }
  };

  const handleAuthorInfo = () => {
    if (quote && quote.author && quote.author !== 'Neznámý autor') {
      router.push({
        pathname: "/author/[authorName]",
        params: { authorName: encodeURIComponent(quote.author) },
      });
    } else {
      Alert.alert('Informace o autorovi', 'Pro tohoto autora nejsou dostupné další informace.');
    }
  };

  const handleFavoritePress = () => {
    onToggleFavorite(quote!);
  };

  return (
    <View style={styles.quoteCard}>
      <Text style={styles.quoteText}>{`"${quote.content}"`}</Text>
      <Text style={styles.authorText}>- {quote.author}</Text>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={handleFavoritePress} style={styles.actionButton}>
          <FontAwesome 
            name={isFavorite ? "heart" : "heart-o"}
            size={getResponsiveFontSize(20)} 
            color={isFavorite ? "#e91e63" : "#555"}
          />
          <Text style={[styles.actionButtonText, { color: isFavorite ? "#e91e63" : "#555" }]}>
            {isFavorite ? "Oblíbená" : "Oblíbit"}
          </Text>
        </TouchableOpacity>

        {quote.author && quote.author !== 'Neznámý autor' && (
          <TouchableOpacity onPress={handleAuthorInfo} style={styles.actionButton}>
            <FontAwesome name="wikipedia-w" size={getResponsiveFontSize(20)} color="#555" />
            <Text style={styles.actionButtonText}>Autor</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
          <FontAwesome name="share-alt" size={getResponsiveFontSize(20)} color="#555" /> 
          <Text style={styles.actionButtonText}>Sdílet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  quoteCard: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 15,
    borderRadius: 12,
    width: '100%',
    maxWidth: 500,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    minHeight: 150, 
    justifyContent: 'space-between',
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
    marginBottom: 20,
  },
  actionsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    minWidth: 60,
  },
  actionButtonText: {
    marginTop: 4,
    fontSize: getResponsiveFontSize(11),
    color: '#555',
  }
});

export default QuoteCard;