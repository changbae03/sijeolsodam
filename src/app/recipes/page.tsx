'use client';

import { useState } from 'react';
import { allRecipes } from '@/data/recipes';
import { SearchBar, SectionTitle } from '@/components/ui';
import RecipeCard from '@/components/RecipeCard';
import Logo from '@/components/Logo';

export default function RecipesPage() {
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? allRecipes.filter(
        (r) =>
          r.title.includes(query) ||
          r.mainIngredient.includes(query) ||
          r.category.includes(query)
      )
    : allRecipes;

  return (
    <main className="max-w-md mx-auto px-5 pt-6 pb-10">
      <header className="mb-6">
        <Logo size="md" />
        <h1 className="font-display text-[24px] text-ink mt-1.5 font-semibold tracking-tight">
          레시피
        </h1>
      </header>

      <div className="mb-6">
        <SearchBar
          placeholder="레시피, 재료, 카테고리로 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <SectionTitle
        overline={`${filtered.length}개의 레시피`}
        overlineColor="soft"
        title={query ? `"${query}" 검색 결과` : '모든 레시피'}
        size="sm"
        className="mb-5"
      />

      {filtered.length === 0 ? (
        <p className="text-[13px] text-ink-soft/70 text-center py-16">
          검색 결과가 없어요. 다른 키워드로 찾아보세요.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </main>
  );
}
