// /**
//  * Translates text using OpenAI's API
//  */
// export async function translateText(
// text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
//   try {
//     const apiKey = process.env.OPENAI_API_KEY;
    
//     if (!apiKey) {
//       throw new Error('OpenAI API key is not set');
//     }

//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${apiKey}`
//       },
//       body: JSON.stringify({
//          model: 'gpt-3.5-turbo',
//        // model: 'gpt-4',
//         messages: [
//           {
//             role: 'system',
//             content: `You are a professional medical translator. Translate the following text from ${sourceLanguage} to ${targetLanguage}. Maintain medical accuracy and terminology. Only respond with the translated text, nothing else.`
//           },
//           {
//             role: 'user',
//             content: text
//           }
//         ],
//         temperature: 0.3,
//         max_tokens: 1000
//       })
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
//     }

//     const data = await response.json();
//     return data.choices[0].message.content.trim();
//   } catch (error) {
//     console.error('Translation error:', error);
//     throw error;
//   }
// }




/**
 * Translates text using OpenAI's API.
 */
export async function translateText(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> {
  
  console.log('Calling translateText with:', text, sourceLanguage, targetLanguage);
  
  try {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key is not set.');
    }

    if (!text.trim()) {
      throw new Error('Text to translate cannot be empty.');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // or 'gpt-4' if preferred
        messages: [
          {
            role: 'system',
            content: `You are a professional medical translator. Translate the following text from ${sourceLanguage} to ${targetLanguage}. Maintain medical accuracy and terminology. Only respond with the translated text, nothing else.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: Math.min(1000, text.length * 2) // Adjust token limit dynamically
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const translatedText = data.choices?.[0]?.message?.content?.trim();
    
    if (!translatedText) {
      throw new Error('Translation failed: No response from OpenAI.');
    }

    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}
