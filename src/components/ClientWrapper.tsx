'use client';

import React, { useState } from 'react';
import LoadingScreen from './LoadingScreen';

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      )}
      <main className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}>
        {children}
      </main>
    </>
  );
}
