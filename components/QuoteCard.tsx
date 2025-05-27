import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Quote } from '../utils/api';
import { getResponsiveFontSize } from '../utils/uiHelpers';

interface QuoteCardProps {
  quote: Quote | null;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote }) => {
  if (!quote) {
    return null;
  }

  return (
    <View style={styles.quoteCard}>
      <Text style={styles.quoteText}>{quote.content}</Text>
      <Text style={styles.authorText}>- {quote.author}</Text>
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
});

export default QuoteCard;