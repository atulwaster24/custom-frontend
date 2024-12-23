import { getBrowserInstance } from "@/utils/browserManager";

export async function GET() {
  try {
    // Retrieve the Puppeteer browser instance and page
    console.log("inGetCurrentUrl");
    const { page } = await getBrowserInstance();

    if (!page || page.isClosed()) {
      return new Response(
        JSON.stringify({ message: "Puppeteer page instance is not available or already closed." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get the current URL from the page
    const currentUrl = page.url();

    // Respond with the current URL
    return new Response(
      JSON.stringify({ currentUrl }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching current URL:", error.message);
    return new Response(
      JSON.stringify({ message: "Failed to fetch current URL.", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
