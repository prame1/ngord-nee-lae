import fs from 'fs';
import path from 'path';
import { parseThaiDate } from './utils';

export interface Prize {
  id: string;
  name: string;
  reward: string;
  amount: number;
  number: string[];
}

export interface Draw {
  date: string;
  endpoint: string;
  prizes: Prize[];
  runningNumbers?: Prize[];
}

export interface SearchResult {
  date: string;
  prizeName: string;
  reward: string;
  fullNumber: string;
  prizeId: string;
}

export function getAllDraws(): Draw[] {
  try {
    const filePath = path.join(process.cwd(), 'data', 'all_draws.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading all_draws.json:', error);
    return [];
  }
}

export function getDrawsByYear(year: string): Draw[] {
  try {
    const filePath = path.join(process.cwd(), 'data', `${year}.json`);
    if (!fs.existsSync(filePath)) return [];
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading ${year}.json:`, error);
    return [];
  }
}

export function searchNumberInDraws(query: string, draws: Draw[], allowedPrizeIds?: string[]): SearchResult[] {
  if (!query) return [];
  const results: SearchResult[] = [];

  for (const draw of draws) {
    // 1. Check main prizes (Requires exact 6-digit match)
    if (query.length === 6) {
      for (const prize of draw.prizes) {
        if (allowedPrizeIds && !allowedPrizeIds.includes(prize.id)) continue;
        for (const num of prize.number) {
          if (num === query) {
            results.push({
              date: draw.date,
              prizeName: prize.name,
              reward: prize.reward,
              fullNumber: num,
              prizeId: prize.id
            });
          }
        }
      }
    }

    // 2. Check running numbers (2-digit, 3-digit)
    if (draw.runningNumbers) {
      for (const prize of draw.runningNumbers) {
        if (allowedPrizeIds && !allowedPrizeIds.includes(prize.id)) continue;
        
        const isFrontThree = prize.id === 'runningNumberFrontThree';
        const isBackThree = prize.id === 'runningNumberBackThree';
        const isBackTwo = prize.id === 'runningNumberBackTwo';

        for (const prizeNum of prize.number) {
          let isWin = false;

          if (query.length === 6) {
            // If user types 6 digits, check if the relevant part matches
            if (isFrontThree && query.startsWith(prizeNum)) isWin = true;
            if (isBackThree && query.endsWith(prizeNum)) isWin = true;
            if (isBackTwo && query.endsWith(prizeNum)) isWin = true;
          } else {
            // If user types 2 or 3 digits, check for exact match with the prize type
            if (isFrontThree && query.length === 3 && query === prizeNum) isWin = true;
            if (isBackThree && query.length === 3 && query === prizeNum) isWin = true;
            if (isBackTwo && query.length === 2 && query === prizeNum) isWin = true;
          }

          if (isWin) {
            results.push({
              date: draw.date,
              prizeName: prize.name,
              reward: prize.reward,
              fullNumber: prizeNum,
              prizeId: prize.id
            });
          }
        }
      }
    }
  }

  return results;
}

export function getLatestDraw(): Draw | null {
  const all = getAllDraws();
  if (all.length === 0) return null;

  // Filter out placeholder draws (containing 'xxx')
  const validDraws = all.filter(draw => {
    const firstPrize = draw.prizes.find(p => p.id === 'prizeFirst');
    return firstPrize && !firstPrize.number[0].toLowerCase().includes('x');
  });

  if (validDraws.length === 0) return null;

  // Sort descending by date
  return validDraws.sort((a, b) => parseThaiDate(b.date) - parseThaiDate(a.date))[0];
}

export interface NumberFrequency {
  number: string;
  count: number;
}

export interface RankedFrequencies {
  prize1: NumberFrequency[];
  prize2: NumberFrequency[];
  prize3: NumberFrequency[];
  prize4: NumberFrequency[];
  prize5: NumberFrequency[];
  front3: NumberFrequency[];
  back3: NumberFrequency[];
  back2: NumberFrequency[];
}

export function getTopFrequentNumbers(startYear?: number, endYear?: number): RankedFrequencies {
  const allDraws = getAllDraws();
  
  const freqMap: Record<string, Record<string, number>> = {
    prizeFirst: {},
    prizeSecond: {},
    prizeThird: {},
    prizeForth: {},
    prizeFifth: {},
    runningNumberFrontThree: {},
    runningNumberBackThree: {},
    runningNumberBackTwo: {},
  };

  const currentYear = 2567; // Assuming current year based on context
  const sYear = startYear || (currentYear - 2);
  const eYear = endYear || currentYear;

  for (const draw of allDraws) {
    // Parse year from date string (e.g., "30 ธันวาคม 2566")
    const dateParts = draw.date.split(' ');
    const drawYear = parseInt(dateParts[dateParts.length - 1]);
    
    if (drawYear < sYear || drawYear > eYear) continue;

    const processPrizes = (prizes: Prize[], type: 'prizes' | 'running') => {
      for (const prize of prizes) {
        const id = prize.id;
        if (freqMap[id]) {
          prize.number.forEach(num => {
            // Filter out 'xxx'
            if (!num.toLowerCase().includes('x')) {
              freqMap[id][num] = (freqMap[id][num] || 0) + 1;
            }
          });
        }
      }
    };

    processPrizes(draw.prizes, 'prizes');
    if (draw.runningNumbers) {
      processPrizes(draw.runningNumbers, 'running');
    }
  }

  const getTop10 = (id: string) => 
    Object.entries(freqMap[id])
      .map(([number, count]) => ({ number, count }))
      .sort((a, b) => b.count - a.count || a.number.localeCompare(b.number))
      .slice(0, 10);

  return {
    prize1: getTop10('prizeFirst'),
    prize2: getTop10('prizeSecond'),
    prize3: getTop10('prizeThird'),
    prize4: getTop10('prizeForth'),
    prize5: getTop10('prizeFifth'),
    front3: getTop10('runningNumberFrontThree'),
    back3: getTop10('runningNumberBackThree'),
    back2: getTop10('runningNumberBackTwo'),
  };
}
