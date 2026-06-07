'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Componente que escuta erros de permissão do Firestore e os relança
 * para que o Next.js exiba o overlay de erro durante o desenvolvimento.
 */
export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      // Relança o erro de forma que ele seja capturado pelo overlay do Next.js
      // Isso ajuda na depuração de Security Rules.
      setTimeout(() => {
        throw error;
      }, 0);
    };

    errorEmitter.on('permission-error', handleError);
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  return null;
}