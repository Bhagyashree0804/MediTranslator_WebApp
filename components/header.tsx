"use client";

import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { Heart, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500" />
          <span className="text-lg font-bold">MediTranslate</span>
        </div>
        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Info className="h-4 w-4" />
                <span className="sr-only">About</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>About MediTranslate</DialogTitle>
                <DialogDescription>
                  MediTranslate is a healthcare translation web app designed to facilitate communication between healthcare providers and patients who speak different languages.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <h3 className="text-lg font-medium">How to use:</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Select your source and target languages</li>
                  <li>Click "Start Listening" to begin recording speech</li>
                  <li>Speak clearly into your microphone</li>
                  <li>View the real-time transcript and translation</li>
                  <li>Click "Speak Translation" to hear the translated text</li>
                </ol>
                <p className="text-sm text-muted-foreground mt-4">
                  This app uses AI-powered speech recognition, translation, and text-to-speech technology to provide accurate medical translations.
                </p>
              </div>
            </DialogContent>
          </Dialog>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}