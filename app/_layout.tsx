// app/_layout.tsx
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Náhodná Citace',
            headerStyle: { backgroundColor: '#3498db' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="author/[authorName]"
          options={{
            presentation: 'modal',
            headerStyle: { backgroundColor: '#3498db' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
            headerTitleAlign: 'center',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}