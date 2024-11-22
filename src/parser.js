import * as cheerio from "cheerio";
import { URL } from "url";

export function parseLinks(html, baseUrl) {
  const $ = cheerio.load(html);
  const links = [];

  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");
    try {
      const absoluteUrl = new URL(href, baseUrl).href;
      links.push(absoluteUrl);
    } catch {
      // Ignore invalid URLs
    }
  });

  return links;
}
