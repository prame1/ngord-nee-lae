const fs = require('node:fs/promises');
const path = require('node:path');

const BASE_URL = 'https://lotto.api.rayriffy.com';
const DATA_DIR = path.join(__dirname, '../data');
const ALL_DRAWS_FILE = path.join(DATA_DIR, 'all_draws.json');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchAllIds() {
    console.log('Fetching all lottery IDs...');
    let allIds = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        try {
            console.log(`Fetching list page ${page}...`);
            const response = await fetch(`${BASE_URL}/list/${page}`);
            if (!response.ok) {
                if (response.status === 429) {
                    console.warn('Rate limited on list! Waiting 15s...');
                    await sleep(15000);
                    continue; // Retry this page
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.status === 'success' && data.response && data.response.length > 0) {
                const ids = data.response.map(item => item.id);
                allIds = allIds.concat(ids);
                page++;
            } else {
                hasMore = false;
            }
            await sleep(3000); // Increased delay
        } catch (error) {
            console.error(`Error fetching page ${page}:`, error.message);
            hasMore = false; 
        }
    }
    
    return allIds;
}

async function fetchLottoDetail(id) {
    try {
        const response = await fetch(`${BASE_URL}/lotto/${id}`);
        if (!response.ok) {
            if (response.status === 429) {
                console.warn('Rate limited! Waiting 30s...');
                await sleep(30000); // Wait much longer on 429
                return fetchLottoDetail(id); 
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.status === 'success' ? data.response : null;
    } catch (error) {
        console.error(`Failed to fetch ID ${id}:`, error.message);
        return null;
    }
}

async function main() {
    try {
        // ... (rest of main stays mostly same, but increase loop sleep)
        // [Existing logic in main]
        // ...
            const detail = await fetchLottoDetail(id);
            if (detail) {
                detail.id = id;
                existingData.push(detail);
                
                if (count % 5 === 0) { // Save more frequently
                    await fs.writeFile(ALL_DRAWS_FILE, JSON.stringify(existingData, null, 2));
                    console.log('Progress saved.');
                }
            }

            await sleep(3000); // Increased loop delay
        }

        // Final save of all draws
        existingData.sort((a, b) => b.id.localeCompare(a.id));
        await fs.writeFile(ALL_DRAWS_FILE, JSON.stringify(existingData, null, 2));

        // Group by year and save separate files
        console.log('Organizing data by year...');
        const yearGroups = {};
        
        for (const draw of existingData) {
            // ID format: DDMMYYYY (where YYYY is BE)
            const yearBE = draw.id.substring(4); 
            
            if (!yearGroups[yearBE]) yearGroups[yearBE] = [];
            yearGroups[yearBE].push(draw);
        }

        for (const [year, data] of Object.entries(yearGroups)) {
            const yearFile = path.join(DATA_DIR, `${year}.json`);
            await fs.writeFile(yearFile, JSON.stringify(data, null, 2));
        }

        console.log('Successfully completed! Data is ready in /data folder.');

    } catch (error) {
        console.error('Fatal error:', error);
    }
}

main();
