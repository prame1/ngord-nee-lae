const fs = require('node:fs/promises');
const path = require('node:path');

const DATA_DIR = path.join(__dirname, '../data');
const ALL_DRAWS_FILE = path.join(DATA_DIR, 'all_draws.json');

/**
 * Formats a Date object to Thai Date String (e.g., "1 มิถุนายน 2569")
 */
function formatDateToThai(date) {
  const months = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear() + 543;
  return `${day} ${month} ${year}`;
}

/**
 * Fetches lottery results from GLO API for a specific date
 */
async function fetchFromGLO(day, month, year) {
  const url = 'https://www.glo.or.th/api/checking/getLotteryResult';
  const body = JSON.stringify({
    date: day.toString().padStart(2, '0'),
    month: month.toString().padStart(2, '0'),
    year: year.toString()
  });

  console.log(`Fetching GLO data for: ${day}/${month}/${year}...`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    });

    const result = await response.json();

    if (result.status && result.response && result.response.result) {
      const gloData = result.response.result;
      
      // Map GLO structure to our Draw interface
      const dateObj = new Date(gloData.date);
      const yearBE = dateObj.getFullYear() + 543;
      const id = dateObj.getDate().toString().padStart(2, '0') + 
                 (dateObj.getMonth() + 1).toString().padStart(2, '0') + 
                 yearBE.toString();

      return {
        date: formatDateToThai(dateObj),
        endpoint: url,
        id: id,
        prizes: [
          { id: 'prizeFirst', name: 'รางวัลที่ 1', reward: '6000000', amount: 1, number: gloData.data.first.number.map(n => n.value) },
          { id: 'prizeFirstNear', name: 'รางวัลข้างเคียงรางวัลที่ 1', reward: '100000', amount: 2, number: gloData.data.near1.number.map(n => n.value) },
          { id: 'prizeSecond', name: 'รางวัลที่ 2', reward: '200000', amount: 5, number: gloData.data.second.number.map(n => n.value) },
          { id: 'prizeThird', name: 'รางวัลที่ 3', reward: '80000', amount: 10, number: gloData.data.third.number.map(n => n.value) },
          { id: 'prizeForth', name: 'รางวัลที่ 4', reward: '40000', amount: 50, number: gloData.data.fourth.number.map(n => n.value) },
          { id: 'prizeFifth', name: 'รางวัลที่ 5', reward: '20000', amount: 100, number: gloData.data.fifth.number.map(n => n.value) },
        ],
        runningNumbers: [
          { id: 'runningNumberFrontThree', name: 'รางวัลเลขหน้า 3 ตัว', reward: '4000', amount: 2, number: gloData.data.last3f.number.map(n => n.value) },
          { id: 'runningNumberBackThree', name: 'รางวัลเลขท้าย 3 ตัว', reward: '4000', amount: 2, number: gloData.data.last3b.number.map(n => n.value) },
          { id: 'runningNumberBackTwo', name: 'รางวัลเลขท้าย 2 ตัว', reward: '2000', amount: 1, number: gloData.data.last2.number.map(n => n.value) },
        ]
      };
    }
  } catch (error) {
    console.error(`Error fetching for ${day}/${month}/${year}:`, error.message);
  }
  return null;
}

/**
 * Fetches the absolute latest lottery results from GLO API
 */
async function fetchLatestFromGLO() {
  const url = 'https://www.glo.or.th/api/lottery/getLatestLottery';
  console.log('Fetching absolute latest GLO data...');
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const result = await response.json();

    if (result.status && result.response) {
      const gloData = result.response;
      
      const dateObj = new Date(gloData.date);
      const yearBE = dateObj.getFullYear() + 543;
      const id = dateObj.getDate().toString().padStart(2, '0') + 
                 (dateObj.getMonth() + 1).toString().padStart(2, '0') + 
                 yearBE.toString();

      return {
        date: formatDateToThai(dateObj),
        endpoint: url,
        id: id,
        prizes: [
          { id: 'prizeFirst', name: 'รางวัลที่ 1', reward: '6000000', amount: 1, number: gloData.data.first.number.map(n => n.value) },
          { id: 'prizeFirstNear', name: 'รางวัลข้างเคียงรางวัลที่ 1', reward: '100000', amount: 2, number: gloData.data.near1.number.map(n => n.value) },
          { id: 'prizeSecond', name: 'รางวัลที่ 2', reward: '200000', amount: 5, number: gloData.data.second.number.map(n => n.value) },
          { id: 'prizeThird', name: 'รางวัลที่ 3', reward: '80000', amount: 10, number: gloData.data.third.number.map(n => n.value) },
          { id: 'prizeForth', name: 'รางวัลที่ 4', reward: '40000', amount: 50, number: gloData.data.fourth.number.map(n => n.value) },
          { id: 'prizeFifth', name: 'รางวัลที่ 5', reward: '20000', amount: 100, number: gloData.data.fifth.number.map(n => n.value) },
        ],
        runningNumbers: [
          { id: 'runningNumberFrontThree', name: 'รางวัลเลขหน้า 3 ตัว', reward: '4000', amount: 2, number: gloData.data.last3f.number.map(n => n.value) },
          { id: 'runningNumberBackThree', name: 'รางวัลเลขท้าย 3 ตัว', reward: '4000', amount: 2, number: gloData.data.last3b.number.map(n => n.value) },
          { id: 'runningNumberBackTwo', name: 'รางวัลเลขท้าย 2 ตัว', reward: '2000', amount: 1, number: gloData.data.last2.number.map(n => n.value) },
        ]
      };
    }
  } catch (error) {
    console.error('Error fetching absolute latest GLO data:', error.message);
  }
  return null;
}

async function main() {
  try {
    let latestDraw = await fetchLatestFromGLO();
    
    if (!latestDraw) {
      console.log('Falling back to guessed lottery day...');
      const now = new Date();
      // Default to current lottery day
      const targetDay = now.getDate() >= 16 ? 16 : 1;
      const targetMonth = now.getMonth() + 1;
      const targetYear = now.getFullYear();

      latestDraw = await fetchFromGLO(targetDay, targetMonth, targetYear);
    }
    
    if (!latestDraw) {
      console.log('No new draw found yet or API error.');
      return;
    }

    // Load existing data
    let existingData = [];
    try {
      const content = await fs.readFile(ALL_DRAWS_FILE, 'utf8');
      existingData = JSON.parse(content);
    } catch (e) {
      console.log('Starting fresh with new draw data.');
    }

    // Update data
    const existingIndex = existingData.findIndex(d => d.date === latestDraw.date);
    if (existingIndex > -1) {
      existingData[existingIndex] = latestDraw;
      console.log(`Updated existing draw: ${latestDraw.date}`);
    } else {
      existingData.push(latestDraw);
      console.log(`Added new draw: ${latestDraw.date}`);
    }

    // Sort descending
    existingData.sort((a, b) => b.id.localeCompare(a.id));

    // Save all_draws.json
    await fs.writeFile(ALL_DRAWS_FILE, JSON.stringify(existingData, null, 2));

    // Group by year
    const yearGroups = {};
    for (const draw of existingData) {
      const yearBE = draw.id.substring(4);
      if (!yearGroups[yearBE]) yearGroups[yearBE] = [];
      yearGroups[yearBE].push(draw);
    }

    // Save individual year files
    for (const [year, data] of Object.entries(yearGroups)) {
      const yearFile = path.join(DATA_DIR, `${year}.json`);
      await fs.writeFile(yearFile, JSON.stringify(data, null, 2));
      console.log(`Saved ${year}.json`);
    }

    console.log('Successfully updated all data files from GLO API.');
  } catch (error) {
    console.error('Fatal error:', error);
  }
}

main();
