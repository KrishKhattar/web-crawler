import { crawl } from "./crawler.js";

const startUrl = "https://en.wikipedia.org/wiki/Web_crawler";
const maxDepth = 2;

(async () => {
  console.log("Starting web crawler...");
  await crawl(startUrl, 1, maxDepth);
  console.log("Crawling completed!");
})();
