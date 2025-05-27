// app/_layout.tsx
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { RootSiblingParent } from 'react-native-root-siblings'; // Pokud používáte Toasty

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{ // Globální nastavení pro všechny obrazovky ve Stacku
          headerStyle: { backgroundColor: '#3498db' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }} // Samotný "obal tabů" nemá vlastní hlavičku
        />
        <Stack.Screen
          name="author/[authorName]"
          options={{
            title: 'Informace o autorovi',
            headerBackTitle: 'Zpět',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}