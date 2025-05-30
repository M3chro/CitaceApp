/**
 * Reprezentuje strukturu citace, jak ji budeme používat v aplikaci.
 */
export interface Quote {
  id: string;
  content: string;
  author: string;
}

/**
 * Reprezentuje jazyk pro výběr (prozatím jen angličtina).
 */
export interface Language {
  code: string;
  name: string;
}

const RAPIDAPI_KEY = process.env.EXPO_PUBLIC_RAPIDAPI_KEY;
const API_HOST = 'quotes15.p.rapidapi.com';

if (!RAPIDAPI_KEY) {
  console.error(
    "CHYBA: API klíč (EXPO_PUBLIC_RAPIDAPI_KEY) není nastaven v .env souboru. " +
    "Aplikace nebude moci načítat citace."
  );
}

/**
 * Asynchronně načte náhodnou citaci z API pro zadaný jazyk.
 * @param language Kód jazyka (např. 'en', 'cs'). Výchozí je 'en', pokud není zadán.
 * @returns Promise, která se resolvuje na objekt {@link Quote} nebo je rejectnuta s chybou.
 */
export const fetchRandomQuote = async (language: string = 'en'): Promise<Quote> => {
  if (!RAPIDAPI_KEY) {
    return Promise.reject(new Error("API klíč pro RapidAPI není nakonfigurován."));
  }

  const endpointUrl = `https://${API_HOST}/quotes/random/?language_code=${language}`;

  console.log(`[API] Načítám citaci z: ${endpointUrl}`); // Logujeme správný jazyk

  try {
    const response = await fetch(endpointUrl, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': API_HOST,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[API] Chyba HTTP: ${response.status}`, errorBody);
      throw new Error(`Chyba při komunikaci s API (${response.status}). Zkuste to prosím později.`);
    }

    const data = await response.json();
    console.log('[API] Přijatá data:', JSON.stringify(data, null, 2));

    if (data.message && Array.isArray(data.message) && data.message.length > 0) {
        console.warn('[API] API vrátilo zprávu (pravděpodobně nenalezeno):', data.message[0].msg);
        throw new Error(data.message[0].msg || `Pro jazyk '${language}' nebyla nalezena žádná citace.`);
    }

    if (data && typeof data.content === 'string' && data.originator && typeof data.originator.name === 'string') {
      return {
        id: String(data.id || Date.now()),
        content: data.content,
        author: data.originator.name,
      };
    } else {
      console.error('[API] Přijatá data nemají očekávaný formát:', data);
      throw new Error("API vrátilo data v neočekávaném formátu.");
    }
  } catch (error: any) {
    console.error('[API] Obecná chyba při načítání citace:', error.message);
    if (error instanceof Error) {
        throw error;
    } else {
        throw new Error(String(error.message || 'Nastala neznámá chyba.'));
    }
  }
};

/**
 * Vrací seznam dostupných jazyků pro výběr na základě poskytnutého seznamu kódů.
 * @returns Pole objektů {@link Language}.
 */
export const getAvailableLanguages = (): Language[] => {
  return [
    { code: 'en', name: 'English (Angličtina)' },
    { code: 'cs', name: 'Česky' },
    { code: 'de', name: 'Deutsch (Němčina)' },
    { code: 'es', name: 'Español (Španělština)' },
    { code: 'fr', name: 'Français (Francouzština)' },
    { code: 'it', name: 'Italiano (Italština)' },
    { code: 'hu', name: 'Magyar (Maďarština)' },
    { code: 'pl', name: 'Polski (Polština)' },
    { code: 'pt', name: 'Português (Portugalština)' },
    { code: 'ru', name: 'Русский (Ruština)' },
    { code: 'sk', name: 'Slovensky' }
  ];
};