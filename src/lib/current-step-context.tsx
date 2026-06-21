'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AskRequest {
  stepIndex: number;
  nonce: number;
}

interface CurrentStepContextValue {
  currentStepIndex: number;
  setCurrentStepIndex: (index: number) => void;
  servings: number;
  setServings: (servings: number) => void;
  askRequest: AskRequest | null;
  requestAskAboutStep: (stepIndex: number) => void;
}

const CurrentStepContext = createContext<CurrentStepContextValue | undefined>(undefined);

export function CurrentStepProvider({
  children,
  initialServings,
}: {
  children: ReactNode;
  initialServings: number;
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [servings, setServings] = useState(initialServings);
  const [askRequest, setAskRequest] = useState<AskRequest | null>(null);

  const requestAskAboutStep = (stepIndex: number) => {
    setAskRequest({ stepIndex, nonce: Date.now() });
  };

  return (
    <CurrentStepContext.Provider
      value={{
        currentStepIndex,
        setCurrentStepIndex,
        servings,
        setServings,
        askRequest,
        requestAskAboutStep,
      }}
    >
      {children}
    </CurrentStepContext.Provider>
  );
}

export function useCurrentStep() {
  const ctx = useContext(CurrentStepContext);
  if (!ctx) throw new Error('useCurrentStep must be used within CurrentStepProvider');
  return ctx;
}
