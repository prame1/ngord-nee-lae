'use server'

import { getAllDraws, getTopFrequentNumbers, searchNumberInDraws, getDrawsByYear, getLatestDraw, SearchResult, Draw, RankedFrequencies } from '@/lib/lotto';
import { getPopularDreams, DreamArticle } from '@/lib/beliefs';

export async function handleSearch(number: string, allowedPrizeIds?: string[]): Promise<SearchResult[]> {
  const allDraws = getAllDraws();
  return searchNumberInDraws(number, allDraws, allowedPrizeIds);
}

export async function fetchFrequencyData(startYear?: number, endYear?: number): Promise<RankedFrequencies> {
  return getTopFrequentNumbers(startYear, endYear);
}

export async function fetchLatestDrawData(): Promise<Draw | null> {
  return getLatestDraw();
}

export async function fetchYearlyArchive(year: string): Promise<Draw[]> {
  return getDrawsByYear(year);
}

export async function fetchAllDraws(): Promise<Draw[]> {
  return getAllDraws();
}

export async function fetchBeliefs(): Promise<DreamArticle[]> {
  return getPopularDreams();
}
