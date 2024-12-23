import { getBrowserInstance } from "@/utils/browserManager";

export async function GET() {
  try {
    console.log("inGetDashboardData");
    const { page } = await getBrowserInstance();

    if (!page || page.isClosed()) {
      return new Response(
        JSON.stringify({ message: "Puppeteer page instance is not available or already closed." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Scrape the dropdown menu data
    const dropdownData = await page.evaluate(() => {
      // Extract user image URL
      const userImage = document.querySelector(".user-header img")?.src || null;

      // Extract user details
      const location = document.querySelector(".user-header p")?.childNodes[0]?.textContent.trim() || null;
      const role = document.querySelector(".user-header p small")?.textContent.trim() || null;

      // Extract wallet numbers
      const walletNumbers = {};
      document.querySelectorAll(".user-header p small b").forEach((element) => {
        const [key, value] = element.textContent.split(":").map((text) => text.trim());
        walletNumbers[key] = parseInt(value, 10);
      });

      // Extract action links
      const actions = {
        logout: document.querySelector("a[href*='logout.php']")?.href || null,
        changePassword: document.querySelector("a[href*='login_pass.php']")?.href || null,
        profile: document.querySelector("a[href*='login_profile.php']")?.href || null,
      };

      return { userImage, location, role, walletNumbers, actions };
    });

    return new Response(
      JSON.stringify({
        message: "Dropdown data fetched successfully.",
        data: dropdownData,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching dropdown data:", error.message);
    return new Response(
      JSON.stringify({ message: "Failed to fetch dropdown data.", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
