"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, StopCircle, Volume2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { languages } from '@/lib/languages';

import { translateText } from '@/lib/translate';
import { speakText } from '@/lib/tts';

export function TranslationApp() {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [translation, setTranslation] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en-US');
  const [targetLanguage, setTargetLanguage] = useState('es-ES');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current!.continuous = true;
      recognitionRef.current!.interimResults = true;
      recognitionRef.current!.lang = sourceLanguage;

      recognitionRef.current!.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

       // setTranscript((prev) => prev + finalTranscript + interimTranscript);
       setTranscript(finalTranscript + interimTranscript);

      };

      recognitionRef.current!.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        toast({
          title: 'Error',
          description: `Speech recognition error: ${event.error}`,
          variant: 'destructive',
        });
        setIsListening(false);
      };

      recognitionRef.current!.onend = () => {
        if (isListening) {
          recognitionRef.current?.start();
        }
      };
    } else {
      toast({
        title: 'Not Supported',
        description: 'Speech recognition is not supported in this browser.',
        variant: 'destructive',
      });
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [sourceLanguage]);

  // Update recognition language when source language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = sourceLanguage;
    }
  }, [sourceLanguage]);

  // //Translate text when transcript changes
  // useEffect(() => {
  //   const translateTimeout = setTimeout(async () => {
  //     if (transcript && !isTranslating) {
  //       setIsTranslating(true);
  //       try {
  //         const result = await translateText(transcript, sourceLanguage?.split('-')[0], targetLanguage?.split('-')[0], {signal: new AbortSignal} );
  //         setTranslation(result);
  //       } catch (error) {
  //         console.error('Translation error:', error);
  //         toast({
  //           title: 'Translation Error',
  //           description: '..Failed to translate text. Please try again.',
  //           variant: 'destructive',
  //         });
  //       } finally {
  //         setIsTranslating(false);
  //       }
  //     }
  //   }, 1000); // Debounce translation requests

  //   return () => clearTimeout(translateTimeout);
  // }, [transcript, sourceLanguage, targetLanguage]);

//   useEffect(() => {
//   const translateTimeout = setTimeout(async () => {
//     if (transcript?.trim() && !isTranslating) {
//       setIsTranslating(true);
//       try {
//         const result = await translateText(
//           transcript,
//           sourceLanguage?.split('-')[0] || 'en',
//           targetLanguage?.split('-')[0] || 'en',
//           {signal:AbortSignal;}

//         );
//         setTranslation(result);
//       } catch (error) {
//         console.error('Translation error:', error);
//         toast({
//           title: 'Translation Error',
//           description: 'Failed to translate text. Please try again.',
//           variant: 'destructive',
//         });
//       } finally {
//         setIsTranslating(false);
//       }
//     }
//   }, 1000); // Debounce translation requests

//   return () => clearTimeout(translateTimeout);
// }, [transcript, sourceLanguage, targetLanguage, isTranslating]); // Dependencies




useEffect(() => {
  if (!transcript?.trim()) return; // Avoid unnecessary API calls

  //const controller = new AbortController(); // Create an abort controller
 // const signal = controller.signal;

  const translateTimeout = setTimeout(async () => {
    if (!isTranslating) {
      setIsTranslating(true);

      // console.log('Calling translateText function...');
      // const translatedText = await translateText('Hello', 'en', 'fr');
      // console.log('Translation Result:', translatedText);
        

      //console.log('Calling translateText with:', transcript, sourceLanguage, targetLanguage);
      try {

          const result = await translateText(
          transcript,
          sourceLanguage?.split("-")[0],
          targetLanguage?.split("-")[0] ,
         // { signal } // Pass the signal to cancel the request
        );
        setTranslation(result);
      } catch (error) {
        if (console.error.name !== "AbortError") { // Ignore abort errors
          console.error("Translation error:", error);
          toast({
            title: "Translation Error",
            description: "Failed to translate text. Please try again.",
            variant: "destructive",
          });
        }
      } finally {
        setIsTranslating(false);
      }
    }
  }, 1000); // Debounce API requests

  return () => {
    clearTimeout(translateTimeout); // Clear timeout on unmount/re-render
    //controller.abort(); // Cancel any ongoing API requests
  };
}, [transcript, sourceLanguage, targetLanguage]); // Removed isTranslating to avoid extra renders


  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      setTranscript('');
      setTranslation('');
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      setIsListening(true);
    }
  };

  const handleSpeak = async () => {
    if (translation && !isSpeaking) {
      setIsSpeaking(true);
      try {
        await speakText(translation, targetLanguage);
      } catch (error) {
        console.error('TTS error:', error);
        toast({
          title: 'Speech Error',
          description: 'Failed to generate speech. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsSpeaking(false);
      }
    }
  };

  const resetConversation = () => {
    setTranscript('');
    setTranslation('');
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Medi Translation</h1>
        <p className="text-muted-foreground text-center">Real-time translation for healthcare providers and patients</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Patient's Language</label>
          <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Provider's Language</label>
          <Select value={targetLanguage} onValueChange={setTargetLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <Button 
          onClick={toggleListening} 
          variant={isListening ? "destructive" : "default"}
          className="gap-2"
        >
          {isListening ? <StopCircle className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </Button>
        <Button 
          onClick={handleSpeak} 
          disabled={!translation || isSpeaking}
          className="gap-2"
        >
          <Volume2 className="h-4 w-4" />
          Speak Translation
        </Button>
        <Button 
          onClick={resetConversation} 
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      <Tabs defaultValue="split" className="w-full">
        
        <TabsContent value="split">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 h-[300px] overflow-auto">
              <h3 className="font-medium mb-2">Original ({languages.find(l => l.code === sourceLanguage)?.name})</h3>
              <div className="whitespace-pre-wrap">
                {transcript || <span className="text-muted-foreground italic">Start speaking to see transcript...</span>}
              </div>
            </Card>
            <Card className="p-4 h-[300px] overflow-auto">
              <h3 className="font-medium mb-2">Translation ({languages.find(l => l.code === targetLanguage)?.name})</h3>
              <div className="whitespace-pre-wrap">
                {isTranslating ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-primary rounded-full border-t-transparent"></div>
                    <span>Translating...</span>
                  </div>
                ) : translation ? (
                  translation
                ) : (
                  <span className="text-muted-foreground italic">Translation will appear here...</span>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="full">
          <Card className="p-4 h-[300px] overflow-auto">
            <div className="mb-4">
              <h3 className="font-medium mb-2">Original ({languages.find(l => l.code === sourceLanguage)?.name})</h3>
              <div className="whitespace-pre-wrap mb-4 p-3 bg-muted rounded-md">
                {transcript || <span className="text-muted-foreground italic">Start speaking to see transcript...</span>}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Translation ({languages.find(l => l.code === targetLanguage)?.name})</h3>
              <div className="whitespace-pre-wrap p-3 bg-muted rounded-md">
                {isTranslating ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-primary rounded-full border-t-transparent"></div>
                    <span>Translating...</span>
                  </div>
                ) : translation ? (
                  translation
                ) : (
                  <span className="text-muted-foreground italic">Translation will appear here...</span>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}