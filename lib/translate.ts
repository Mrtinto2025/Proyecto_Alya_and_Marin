import translate from '@iamtraction/google-translate';

// Función de traducción usando Google Translate API gratuita
export async function translateToSpanish(text: string): Promise<string> {
  if (!text || text.trim() === '') return '';
  
  try {
    const result = await translate(text, { to: 'es' });
    return result.text;
  } catch (error) {
    console.error('Error traduciendo:', error);
    // Si falla, devolver el texto original
    return text;
  }
}

// Traducir múltiples textos en batch
export async function translateBatch(texts: string[]): Promise<string[]> {
  const promises = texts.map(text => translateToSpanish(text));
  return Promise.all(promises);
}
