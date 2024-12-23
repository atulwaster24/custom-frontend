import puppeteer from "puppeteer";

let browser = null;
let page = null;

// Function to get or reuse the existing browser instance
export const getBrowserInstance = async () => {
  if (browser && browser.isConnected() && page && !page.isClosed()) {
    console.log("Reusing existing Puppeteer instance.");
    return { browser, page };
  }

  console.log("Creating a new Puppeteer instance...");
  browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  page = await browser.newPage();
  await page.goto("http://168.119.140.208/", { waitUntil: "networkidle2" });
  console.log("Puppeteer instance created and navigated to http://168.119.140.208/");

  return { browser, page };
};


// Function to close the Puppeteer browser instance
export const closeBrowserInstance = async () => {
  if (browser) {
    console.log("Closing Puppeteer browser instance...");
    await browser.close();
    browser = null; // Reset browser to allow future creation
    page = null;
    console.log("Browser instance closed.");
  }
};
