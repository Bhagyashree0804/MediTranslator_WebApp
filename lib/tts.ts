/**
 * Converts text to speech using OpenAI's TTS API
 */
export async function speakText(text: string, language: string): Promise<void> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenAI API key is not set');
    }

    // Map language code to voice
    const voiceMap: Record<string, string> = {
      'en-US': 'alloy',
      'es-ES': 'nova',
      'fr-FR': 'nova',
      'de-DE': 'nova',
      'it-IT': 'nova',
      'pt-PT': 'nova',
      'ja-JP': 'nova',
      'zh-CN': 'nova',
      'ko-KR': 'nova',
      'ar-SA': 'nova',
      'hi-IN': 'nova',
      'ru-RU': 'nova',
    };

    // Default to 'alloy' if no specific voice mapping exists
    const voice = voiceMap[language] || 'alloy';

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'tts-1',
        voice: voice,
        input: text,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI TTS API error: ${errorText}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    return new Promise((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve();
      };
      
      audio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl);
        reject(error);
      };
      
      audio.play().catch(reject);
    });
  } catch (error) {
    console.error('TTS error:', error);
    throw error;
  }
}