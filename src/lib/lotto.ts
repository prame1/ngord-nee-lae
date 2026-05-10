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

export function searchNumberInDraws(query: string, draws: Draw[]): SearchResult[] {
  if (!query) return [];
  const results: SearchResult[] = [];

  for (const draw of draws) {
    // Check main prizes
    for (const prize of draw.prizes) {
      for (const num of prize.number) {
        if (num.includes(query)) {
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
    // Check running numbers (2-digit, 3-digit suffixes)
    if (draw.runningNumbers) {
      for (const prize of draw.runningNumbers) {
        for (const num of prize.number) {
          if (num.includes(query)) {
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
  }

  return results;
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
