# CitaceApp - SZZVP - Vývoj mobilní aplikace

Jednoduchá mobilní aplikace pro platformu Android/iOS (postavená pomocí Expo) určená k zobrazování náhodných textových citací z různých jazyků, jejich sdílení, ukládání oblíbených a zobrazení informací o autorech.

## ✨ Funkce

Aplikace implementuje následující funkcionality:

* **Náhodné citace:** Zobrazuje náhodné textové citace.
* **Výběr jazyka:** Umožňuje uživateli zvolit preferovaný jazyk pro zobrazované citace.
* **Sdílení citace:** Umožňuje sdílet aktuální citaci (text a autora) s ostatními aplikacemi v zařízení.
* **Informace o autorovi:** Po kliknutí na ikonu u jména autora zobrazí jeho stránku na Wikipedii (v rámci aplikace pomocí WebView).
* **Oblíbené citace:**
    * Uživatel může označit citaci jako oblíbenou.
    * Oblíbené citace se ukládají lokálně v zařízení.
    * Samostatná obrazovka pro zobrazení a správu seznamu oblíbených citací.
* **Intuitivní ovládání:** Tabová navigace pro snadný přístup k hlavním sekcím.
* **Ochrana proti "spamování":** Ošetření proti příliš rychlému opakovanému načítání citací.

## 🛠️ Použité Technologie

* **Framework:** [Expo](https://expo.dev/) (SDK nejnovější verze)
* **Knihovna UI:** [React Native](https://reactnative.dev/)
* **Jazyk:** [TypeScript](https://www.typescriptlang.org/)
* **Navigace:** [Expo Router](https://docs.expo.dev/router/introduction/) (file-system based routing, tab a stack navigace)
* **Ukládání dat (oblíbené):** [`@react-native-async-storage/async-storage`](https://react-native-async-storage.github.io/async-storage/)
* **Výběr (Picker):** [`@react-native-picker/picker`](https://github.com/react-native-picker/picker)
* **Ikony:** [`@expo/vector-icons`](https://docs.expo.dev/guides/icons/) (konkrétně FontAwesome)
* **WebView:** [`react-native-webview`](https://github.com/react-native-webview/react-native-webview) pro zobrazení Wikipedie.
* **API pro citace:** [Quotes15 na RapidAPI](https://rapidapi.com/martin.svoboda/api/quotes15)

## 🚀 API

Pro načítání citací aplikace využívá **Quotes15 API** dostupné na platformě RapidAPI.
* Odkaz na API: [https://rapidapi.com/martin.svoboda/api/quotes15](https://rapidapi.com/martin.svoboda/api/quotes15)
* Pro spuštění aplikace je nutné mít vlastní API klíč z RapidAPI.

## ⚙️ Nastavení a Instalace

Pro spuštění projektu lokálně postupujte následovně:

### Předpoklady

* Nainstalovaný [Node.js](https://nodejs.org/) (doporučena aktuální LTS verze)
* Nainstalovaný [npm](https://www.npmjs.com/) (obvykle se instaluje s Node.js) nebo [Yarn](https://yarnpkg.com/)
* Expo Go aplikace na vašem mobilním zařízení (Android/iOS) nebo nastavený Android emulátor.

### Kroky instalace

1.  **Klonujte repozitář:**
    ```bash
    git clone https://github.com/M3chro/CitaceApp.git
    cd CitaceApp
    ```

2.  **Nainstalujte závislosti:**
Ve složce `CitaceApp`:
    ```bash
    npm install
    # nebo
    yarn install
    ```

3.  **Nastavení API klíče (proměnné prostředí):**
    * Aplikace vyžaduje API klíč pro přístup k Quotes15 API (ten je nutné si vygenerovat [zde](https://rapidapi.com/martin.svoboda/api/quotes15)).
    * Vytvořte v kořenovém adresáři projektu soubor `.env.local`.
    * Do tohoto souboru vložte váš RapidAPI klíč ve formátu (ukázku lze vidět v `.env.example` souboru):
    ```env
      EXPO_PUBLIC_RAPIDAPI_KEY=VAŠ_SKUTEČNÝ_RAPIDAPI_KLÍČ
    ```

## 📱 Spuštění Aplikace

1.  **Spusťte vývojový server Expo:**
    ```bash
    npx expo start
    ```
      Při spouštění na Expo Go (fyzickém zařízení) je vhodné spustit skrze tunel (ngrok).

    ```bash
    npx expo start --tunnel
    ```

2.  Po spuštění serveru se v terminálu zobrazí QR kód.
    * **Na fyzickém zařízení:** Otevřete aplikaci Expo Go a naskenujte QR kód.
    * **Na emulátoru:** Emulátor se dá například získat při nainstalování [Android Studia](https://developer.android.com/studio). V `Device Manager` ho pak stačí spustit (aplikace byla testována na emulátoru pro Pixel 9 a zároveň lokálně na iPhone 13 mini). V terminálu můžete stisknout klávesu `a` pro spuštění na Android emulátoru (musí být předem spuštěn a nakonfigurován).

## 📂 Struktura Projektu (Zjednodušeně)

* `app/`: Obsahuje soubory pro routování a obrazovky aplikace (využívá Expo Router).
    * `(tabs)/`: Adresář pro obrazovky spravované tabovou navigací (`index.tsx`, `favorites.tsx`) a jejich layout (`_layout.tsx`).
    * `author/`: Adresář pro obrazovky týkající se autora (`[authorName].tsx`).
    * `_layout.tsx`: Hlavní (root) layout aplikace, definuje Stack navigátor.
* `components/`: Znovupoužitelné React komponenty (`QuoteCard.tsx`, `LanguageSelector.tsx`, `StatusDisplay.tsx`).
* `utils/`: Pomocné funkce a moduly (`api.ts` pro komunikaci s API, `storage.ts` pro AsyncStorage, `uiHelpers.ts`).
* `.env.local`: Lokální soubor pro uložení API klíče (není ve verzování).
* `.env.example`: Šablona pro `.env`

## 👨‍💻 Autor

* Jakub Havel