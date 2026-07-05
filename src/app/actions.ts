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
  // 1. Try to fetch from Official GLO API - Latest endpoint (Recommended & Handle shifted dates automatically)
  try {
    const response = await fetch('https://www.glo.or.th/api/lottery/getLatestLottery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    const result = await response.json();

    if (result.status && result.response) {
      const gloData = result.response;
      const mappedData: Draw = {
        date: formatDateToThai(gloData.date),
        endpoint: 'https://www.glo.or.th/api/lottery/getLatestLottery',
        id: '',
        prizes: [
          { id: 'prizeFirst', name: 'รางวัลที่ 1', reward: '6000000', amount: 1, number: gloData.data.first.number.map((n: any) => n.value) },
          { id: 'prizeFirstNear', name: 'รางวัลข้างเคียงรางวัลที่ 1', reward: '100000', amount: 2, number: gloData.data.near1.number.map((n: any) => n.value) },
          { id: 'prizeSecond', name: 'รางวัลที่ 2', reward: '200000', amount: 5, number: gloData.data.second.number.map((n: any) => n.value) },
          { id: 'prizeThird', name: 'รางวัลที่ 3', reward: '80000', amount: 10, number: gloData.data.third.number.map((n: any) => n.value) },
          { id: 'prizeForth', name: 'รางวัลที่ 4', reward: '40000', amount: 50, number: gloData.data.fourth.number.map((n: any) => n.value) },
          { id: 'prizeFifth', name: 'รางวัลที่ 5', reward: '20000', amount: 100, number: gloData.data.fifth.number.map((n: any) => n.value) },
        ],
        runningNumbers: [
          { id: 'runningNumberFrontThree', name: 'รางวัลเลขหน้า 3 ตัว', reward: '4000', amount: 2, number: gloData.data.last3f.number.map((n: any) => n.value) },
          { id: 'runningNumberBackThree', name: 'รางวัลเลขท้าย 3 ตัว', reward: '4000', amount: 2, number: gloData.data.last3b.number.map((n: any) => n.value) },
          { id: 'runningNumberBackTwo', name: 'รางวัลเลขท้าย 2 ตัว', reward: '2000', amount: 1, number: gloData.data.last2.number.map((n: any) => n.value) },
        ]
      };
      
      // Update ID to match DDMMYYYY format
      const dateParts = gloData.date.split('-'); // YYYY-MM-DD
      mappedData.id = dateParts[2] + dateParts[1] + (parseInt(dateParts[0]) + 543).toString();

      return mappedData;
    }
  } catch (error) {
    console.error('GLO Latest API failed, trying fallback by date:', error);
  }

  // 2. Fallback to Official GLO API by Date (Guessed date)
  try {
    const now = new Date();
    // Lottery draws are on 1st and 16th. 
    // If it's before the 16th, try the 1st of current month.
    // If it's after the 16th, try the 16th of current month.
    const day = now.getDate() >= 16 ? '16' : '01';
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = (now.getFullYear()).toString();

    const response = await fetch('https://www.glo.or.th/api/checking/getLotteryResult', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: day, month: month, year: year }),
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    const result = await response.json();

    if (result.status && result.response && result.response.result) {
      const gloData = result.response.result;
      const mappedData: Draw = {
        date: formatDateToThai(gloData.date),
        endpoint: 'https://www.glo.or.th/api/checking/getLotteryResult',
        id: '',
        prizes: [
          { id: 'prizeFirst', name: 'รางวัลที่ 1', reward: '6000000', amount: 1, number: gloData.data.first.number.map((n: any) => n.value) },
          { id: 'prizeFirstNear', name: 'รางวัลข้างเคียงรางวัลที่ 1', reward: '100000', amount: 2, number: gloData.data.near1.number.map((n: any) => n.value) },
          { id: 'prizeSecond', name: 'รางวัลที่ 2', reward: '200000', amount: 5, number: gloData.data.second.number.map((n: any) => n.value) },
          { id: 'prizeThird', name: 'รางวัลที่ 3', reward: '80000', amount: 10, number: gloData.data.third.number.map((n: any) => n.value) },
          { id: 'prizeForth', name: 'รางวัลที่ 4', reward: '40000', amount: 50, number: gloData.data.fourth.number.map((n: any) => n.value) },
          { id: 'prizeFifth', name: 'รางวัลที่ 5', reward: '20000', amount: 100, number: gloData.data.fifth.number.map((n: any) => n.value) },
        ],
        runningNumbers: [
          { id: 'runningNumberFrontThree', name: 'รางวัลเลขหน้า 3 ตัว', reward: '4000', amount: 2, number: gloData.data.last3f.number.map((n: any) => n.value) },
          { id: 'runningNumberBackThree', name: 'รางวัลเลขท้าย 3 ตัว', reward: '4000', amount: 2, number: gloData.data.last3b.number.map((n: any) => n.value) },
          { id: 'runningNumberBackTwo', name: 'รางวัลเลขท้าย 2 ตัว', reward: '2000', amount: 1, number: gloData.data.last2.number.map((n: any) => n.value) },
        ]
      };
      
      // Update ID to match DDMMYYYY format
      const dateParts = gloData.date.split('-'); // YYYY-MM-DD
      mappedData.id = dateParts[2] + dateParts[1] + (parseInt(dateParts[0]) + 543).toString();

      return mappedData;
    }
  } catch (error) {
    console.error('GLO Date API failed:', error);
  }

  // 2. Fallback to Legacy Rayriffy API (for historical check if still works)
  try {
    const response = await fetch('https://lotto.api.rayriffy.com/lotto/latest', {
      next: { revalidate: 60 } 
    });
    const result = await response.json();

    if (result.status === 'success' && result.response) {
      const apiData = result.response;
      const firstPrize = apiData.prizes.find((p: any) => p.id === 'prizeFirst');
      if (firstPrize && !firstPrize.number[0].toLowerCase().includes('x')) {
        return apiData as Draw;
      }
    }
  } catch (error) {
    // Silent fail for fallback
  }

  // 3. Fallback to local JSON files
  return getLatestDraw();
}

function formatDateToThai(dateStr: string): string {
  // dateStr is "YYYY-MM-DD"
  const months = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  const parts = dateStr.split('-');
  const day = parseInt(parts[2]);
  const month = months[parseInt(parts[1]) - 1];
  const year = parseInt(parts[0]) + 543;
  return `${day} ${month} ${year}`;
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
