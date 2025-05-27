import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    Alert,
    Button,
    Linking,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export default function AuthorDetailScreen() {
  const params = useLocalSearchParams<{ authorName?: string }>();

  const authorNameFromParams = params.authorName || '';
  const authorName = decodeURIComponent(authorNameFromParams);

  const wikipediaLanguage = 'cs'; // Jenom česká wiki
  const wikipediaUrl = `https://${wikipediaLanguage}.m.wikipedia.org/wiki/${authorName.replace(/ /g, '_')}`;

  const handleOpenInBrowser = () => {
    Linking.canOpenURL(wikipediaUrl).then(supported => {
      if (supported) {
        Linking.openURL(wikipediaUrl);
      } else {
        Alert.alert("Chyba", `Nelze otevřít URL: ${wikipediaUrl}`);
      }
    }).catch(err => {
        console.error("Chyba při kontrole URL pro Linking.openURL: ", err);
        Alert.alert("Chyba", "Při pokusu o otevření odkazu nastala chyba.");
    });
  };

  if (!params.authorName) {
      return (
          <SafeAreaView style={styles.safeArea}>
              <Stack.Screen options={{ title: 'Chyba', headerBackTitle: 'Zpět' }} />
              <View style={styles.loadingContainer}>
                  <Text style={{color: 'red'}}>Jméno autora nebylo poskytnuto.</Text>
              </View>
          </SafeAreaView>
      )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: authorName || 'Informace o autorovi',
          headerBackTitle: 'Zpět',
        }}
      />
      <WebView
        source={{ uri: wikipediaUrl }}
        style={styles.webView}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text>Načítám Wikipedii pro autora: {authorName}</Text>
          </View>
        )}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn(
            'WebView HTTP error: ',
            nativeEvent.url,
            nativeEvent.statusCode,
            nativeEvent.description
          );
        }}
      />
      <View style={styles.openInBrowserButtonContainer}>
        <Button title={`Otevřít "${authorName}" v prohlížeči`} onPress={handleOpenInBrowser} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  openInBrowserButtonContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
  }
});