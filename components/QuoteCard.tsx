import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Alert, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Quote } from '../utils/api';
import { getResponsiveFontSize } from '../utils/uiHelpers';

interface QuoteCardProps {
  quote: Quote | null;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote }) => {
  if (!quote) {
    return null;
  }

  const handleShare = async () => {
    if (!quote) return;

    try {
      const messageToShare = `"${quote.content}" - ${quote.author}`;
      const result = await Share.share(
        {
          message: messageToShare,
          title: 'Podívej se na tuto citaci!',
        },
        {
          // Android only:
          dialogTitle: 'Sdílet citaci pomocí...',
          // iOS only:
          subject: 'Zajímavá citace', // Předmět pro email nebo jiné aktivity
        }
      );

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Sdíleno s aktivitou typu result.activityType
          console.log(`Sdíleno s aktivitou: ${result.activityType}`);
        } else {
          // Sdíleno
          console.log('Citace byla úspěšně sdílena.');
        }
      } else if (result.action === Share.dismissedAction) {
        // Sdílení bylo zrušeno (pouze iOS)
        console.log('Sdílení zrušeno.');
      }
    } catch (error: any) {
      Alert.alert('Chyba', 'Při sdílení citace nastala chyba.');
      console.error('Chyba při sdílení:', error.message);
    }
  };

  return (
    <View style={styles.quoteCard}>
      <Text style={styles.quoteText}>{`"${quote.content}"`}</Text>
      <Text style={styles.authorText}>- {quote.author}</Text>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
          <FontAwesome name="share-alt" size={getResponsiveFontSize(22)} color="#555" />
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
    paddingVertical: 25,
    borderRadius: 12,
    width: '100%',
    maxWidth: 500,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    minHeight: 150,
    justifyContent: 'center',
  },
  quoteText: {
    fontSize: getResponsiveFontSize(19),
    fontStyle: 'italic',
    color: '#34495e',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: getResponsiveFontSize(28),
  },
  authorText: {
    fontSize: getResponsiveFontSize(16),
    color: '#2c3e50',
    textAlign: 'right',
    fontWeight: '500',
    marginTop: 10,
  },
  actionsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 20,
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: getResponsiveFontSize(14),
    color: '#555',
    fontWeight: '500',
  }
});

export default QuoteCard;