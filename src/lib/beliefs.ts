import fs from 'fs';
import path from 'path';

export interface DreamArticle {
  id: string;
  title: string;
  description: string;
  luckyNumbers: string[];
  category: string;
}

export function getPopularDreams(): DreamArticle[] {
  try {
    const filePath = path.join(process.cwd(), 'data', 'popular_dreams.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading popular_dreams.json:', error);
    return [];
  }
}
