// src/app/(public)/search/page.tsx
import { Suspense } from 'react';
import SearchResultsClient from './SearchResultsClient';

export default function SearchPage() {
  return (
    <div className="p-4">
      <Suspense fallback={<p>Loading search results...</p>}>
        <SearchResultsClient />
      </Suspense>
    </div>
  );
}
