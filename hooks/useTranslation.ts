import { useEffect, useState } from 'react';

/**
 * Hook para traducir texto al español de forma asíncrona
 * Usa MyMemory Translation API (completamente gratuita y sin límites)
 */
export function useTranslation(text: string) {
  const [translatedText, setTranslatedText] = useState(text);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (!text || text.trim() === '') {
      setTranslatedText(text);
      return;
    }

    // Si el texto es muy corto, probablemente ya esté en español
    if (text.length < 50) {
      setTranslatedText(text);
      return;
    }

    const translateText = async () => {
      try {
        setIsTranslating(true);
        
        // Usar MyMemory API (gratuita)
        const encodedText = encodeURIComponent(text.substring(0, 500)); // Limitar a 500 caracteres
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=en|es`,
          { 
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          }
        );

        const data = await response.json();
        
        if (data.responseStatus === 200 && data.responseData?.translatedText) {
          setTranslatedText(data.responseData.translatedText);
        } else {
          // Si falla, mantener el original
          setTranslatedText(text);
        }
      } catch (error) {
        console.error('Error en traducción:', error);
        // Si hay error, mantener el texto original
        setTranslatedText(text);
      } finally {
        setIsTranslating(false);
      }
    };

    translateText();
  }, [text]);

  return { translatedText, isTranslating };
}
