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
  code: string; // Kód jazyka (uvažujeme pouze "en")
  name: string;
}

const RAPIDAPI_KEY = process.env.EXPO_PUBLIC_RAPIDAPI_KEY;
const API_HOST = 'quotes15.p.rapidapi.com'; // Hostitel API

if (!RAPIDAPI_KEY) {
  console.error(
    "CHYBA: API klíč (EXPO_PUBLIC_RAPIDAPI_KEY) není nastaven v .env souboru. " +
    "Aplikace nebude moci načítat citace."
  );
}

/**
 * Asynchronně načte náhodnou citaci z API.
 * Prozatím je jazyk nastaven napevno na angličtinu ('en').
 * @returns Promise, která se resolvuje na objekt {@link Quote} nebo je rejectnuta s chybou.
 */
export const fetchRandomQuote = async (): Promise<Quote> => {
  // Pokud API klíč chybí, vrátíme chybu rovnou
  if (!RAPIDAPI_KEY) {
    return Promise.reject(new Error("API klíč pro RapidAPI není nakonfigurován."));
  }

  const languageCode = 'en'; // Napevno nastavená angličtina
  const endpointUrl = `https://${API_HOST}/quotes/random/?language_code=${languageCode}`;

  console.log(`[API] Načítám citaci z: ${endpointUrl}`);

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
        throw new Error(data.message[0].msg || `Pro jazyk '${languageCode}' nebyla nalezena žádná citace.`);
    }

    if (data && typeof data.content === 'string' && data.originator && typeof data.originator.name === 'string') {
      // Transformace dat z API na náš interní formát `Quote`
      return {
        id: String(data.id || Date.now()),
        content: data.content,
        author: data.originator.name,
      };
    } else {
      // Pokud data nemají očekávanou strukturu
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
 * Vrací seznam dostupných jazyků. Pro zjednodušení nyní obsahuje pouze angličtinu.
 * @returns Pole objektů {@link Language}.
 */
export const getAvailableLanguages = (): Language[] => {
  return [
    { code: 'en', name: 'English' },
    // { code: 'cs', name: 'Česky' },
    // ...
  ];
};