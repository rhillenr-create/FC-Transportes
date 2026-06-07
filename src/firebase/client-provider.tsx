
'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

export const FirebaseClientProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // Inicializa o Firebase no cliente de forma estável
  const [instances, setInstances] = useState<{
    firebaseApp: any;
    firestore: any;
    auth: any;
  } | null>(null);

  useEffect(() => {
    const initialized = initializeFirebase();
    setInstances(initialized);
  }, []);

  if (!instances) {
    return (
      <div className="min-h-screen bg-[#040505] flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <FirebaseProvider 
      firebaseApp={instances.firebaseApp} 
      firestore={instances.firestore} 
      auth={instances.auth}
    >
      {children}
    </FirebaseProvider>
  );
};
