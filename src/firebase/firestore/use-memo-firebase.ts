'use client';

import { useMemo, useRef } from 'react';

/**
 * Hook para estabilizar referências do Firestore (Query, DocumentReference).
 * Garante que a referência só mude se as dependências realmente mudarem.
 */
export function useMemoFirebase<T>(factory: () => T, dependencies: any[]): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, dependencies);
}
