import axios from 'axios';
import { parseLinks } from './parser.js';
import { delay, canCrawl } from './utils.js';
import fs from 'fs/promises';

const visitedUrls = new Set();

export async function crawl(url, depth, maxDepth) {
    if (depth > maxDepth || visitedUrls.has(url)) return;

    visitedUrls.add(url);
    console.log(`Crawling (${depth}/${maxDepth}): ${url}`);

    try {
        // Check if the URL is allowed to be crawled
        const isAllowed = await canCrawl(url);
        if (!isAllowed) {
            console.log(`Blocked by robots.txt: ${url}`);
            return;
        }

        const response = await axios.get(url);
        const links = parseLinks(response.data, url);

        console.log(`Found ${links.length} links on ${url}`);
        
        // Save links to a file
        await saveLinks(url, links);

        // Throttle requests to avoid overloading servers
        await delay(1000);

        // Recursively crawl the links
        for (const link of links) {
            await crawl(link, depth + 1, maxDepth);
        }
    } catch (error) {
        console.error(`Error crawling ${url}:`, error.message);
    }
}

async function saveLinks(url, links) {
    const data = { [url]: links };
    const filePath = './data/crawled-links.json';
    try {
        let existingData = [];
        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            existingData = JSON.parse(fileContent);
        } catch {
            // File might not exist initially
        }
        existingData.push(data);
        await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
    } catch (err) {
        console.error('Error saving links:', err);
    }
}
