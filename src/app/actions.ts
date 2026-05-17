'use server'

import { getAllDraws, getTopFrequentNumbers, searchNumberInDraws, getDrawsByYear, getLatestDraw, SearchResult, Draw, RankedFrequencies } from '@/lib/lotto';
import { getPopularDreams, DreamArticle } from '@/lib/beliefs';
import { parseThaiDate } from '@/lib/utils';

export async function handleSearch(number: string, allowedPrizeIds?: string[]): Promise<SearchResult[]> {
  const allDraws = getAllDraws();
  return searchNumberInDraws(number, allDraws, allowedPrizeIds);
}

export async function fetchFrequencyData(startYear?: number, endYear?: number): Promise<RankedFrequencies> {
  return getTopFrequentNumbers(startYear, endYear);
}

export async function fetchLatestDrawData(): Promise<Draw | null> {
  try {
    // 1. Try to fetch from External API (Rayriffy) for real-time data
    const response = await fetch('https://lotto.api.rayriffy.com/lotto/latest', {
      next: { revalidate: 60 } // Cache for 1 minute
    });
    const result = await response.json();

    if (result.status === 'success' && result.response) {
      const apiData = result.response;
      
      // Check if it's real data (not placeholder 'xxxxxx')
      const firstPrize = apiData.prizes.find((p: any) => p.id === 'prizeFirst');
      if (firstPrize && !firstPrize.number[0].toLowerCase().includes('x')) {
        return apiData as Draw;
      }
    }
  } catch (error) {
    console.error('External API failed, falling back to local data:', error);
  }

  // 2. Fallback to local JSON files if API fails or data is not yet ready
  return getLatestDraw();
}

export async function fetchYearlyArchive(year: string): Promise<Draw[]> {
  const data = getDrawsByYear(year);
  return [...data].sort((a, b) => parseThaiDate(b.date) - parseThaiDate(a.date));
}

export async function fetchAllDraws(): Promise<Draw[]> {
  const data = getAllDraws();
  return [...data].sort((a, b) => parseThaiDate(b.date) - parseThaiDate(a.date));
}

export async function checkLotteryNumbers(numbers: string[], drawDate: string): Promise<{ number: string, prizes: SearchResult[] }[]> {
  // 1. Get the latest draw (could be from API)
  const latest = await fetchLatestDrawData();
  
  // 2. Get all historical draws
  const allDraws = getAllDraws();
  
  // 3. Combine them to ensure the search target is found
  const combinedDraws = [...allDraws];
  if (latest && !combinedDraws.find(d => d.date === latest.date)) {
    combinedDraws.push(latest);
  }

  const targetDraw = combinedDraws.find(d => d.date === drawDate);
  
  if (!targetDraw) return numbers.map(n => ({ number: n, prizes: [] }));

  return numbers.map(num => {
    const prizes = searchNumberInDraws(num, [targetDraw]);
    return { number: num, prizes };
  });
}

export async function fetchBeliefs(): Promise<DreamArticle[]> {
  return getPopularDreams();
}
