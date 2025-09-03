'use client';

import { ReactNode } from 'react';
import Chatbot from './Chatbot';

interface ChatbotProviderProps {
  children: ReactNode;
}

export default function ChatbotProvider({ children }: ChatbotProviderProps) {
  return (
    <>
      {children}
      <Chatbot />
    </>
  );
}
