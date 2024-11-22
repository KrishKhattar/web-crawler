import axios from "axios";
import robotsParser from "robots-parser";

// Delay function
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Robots.txt handler
export async function canCrawl(url) {
  const robotsUrl = new URL("/robots.txt", url).href;
  try {
    const response = await axios.get(robotsUrl);
    const robots = robotsParser(robotsUrl, response.data);
    return robots.isAllowed(url);
  } catch {
    // Assume allowed if robots.txt is not accessible
    return true;
  }
}
