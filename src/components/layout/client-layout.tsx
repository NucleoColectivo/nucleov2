"use client";

import { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { AppProvider, useApp } from '@/context/app-context';
import { LanguageProvider } from '@/context/language-context';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LoginModal } from '@/components/modals/login-modal';
import { RadioPlayer } from '@/components/radio/radio-player';
import { motion } from 'framer-motion';

function GlobalLayout({ children }: { children: React.ReactNode }) {
  const { 
    isLoginOpen,
    currentStation,
    isPlaying,
    setIsPlaying,
    isPlayerExpanded,
    setIsPlayerExpanded,
    setAudioAnalyser,
    volume,
    isMuted,
    initAudio,
    playSound
  } = useApp();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleFirstInteraction = () => {
      initAudio();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [initAudio]);

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col min-h-screen"
    >
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      {isLoginOpen && <LoginModal />}
      {currentStation && (
        <RadioPlayer
          currentStation={currentStation}
          isPlaying={isPlaying}
          onTogglePlay={() => {
            playSound('click');
            setIsPlaying(!isPlaying);
          }}
          isExpanded={isPlayerExpanded}
          setIsExpanded={setIsPlayerExpanded}
          onAnalyserReady={setAudioAnalyser}
          volume={volume}
          isMuted={isMuted}
        />
      )}
    </motion.div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <AppProvider>
        <LanguageProvider>
          <GlobalLayout>
            {children}
          </GlobalLayout>
          <Toaster />
        </LanguageProvider>
      </AppProvider>
    </FirebaseClientProvider>
  );
}
