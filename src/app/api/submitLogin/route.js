import { getBrowserInstance } from "@/utils/browserManager";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("inSubmitLogin");
    const { browser, page } = await getBrowserInstance();

    if ((!browser && !browser.isConnected() && !page) || page.isClosed()) {
      throw new Error(
        "Puppeteer page instance is not available or already closed."
      );
    }

    // Fill in the email
    // Clear and fill in the email field
    await page.evaluate(() => {
      const emailField = document.getElementById("name");
      if (emailField) emailField.value = ""; // Clear the field
    });
    await page.type("#name", email);

    // Clear and fill in the password field
    await page.evaluate(() => {
      const passwordField = document.getElementById("password");
      if (passwordField) passwordField.value = ""; // Clear the field
    });
    await page.type("#password", password);

    // Get the captcha value
    const captchaValue = await page.evaluate(() => {
      const captchaDiv = document.getElementById("CaptchaDiv");
      return captchaDiv ? captchaDiv.textContent.trim() : null;
    });

    if (!captchaValue) {
      throw new Error("Captcha not found on the page.");
    }

    // Clear and fill in the captcha field
    await page.evaluate(() => {
      const captchaField = document.getElementById("CaptchaInput");
      if (captchaField) captchaField.value = ""; // Clear the field
    });
    await page.type("#CaptchaInput", captchaValue);

    // Click the login button
    await page.click("#submit");

    // Wait for navigation or page update
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    // Check for error message on the page
    const errorMessage = await page.evaluate(() => {
      const errorElement = document.querySelector("strong");
      return errorElement ? errorElement.textContent.trim() : null;
    });

    if (errorMessage === "Invalid email id or password.") {
      return new Response(
        JSON.stringify({
          message: "Invalid email or password.",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if we navigated to the dashboard
    const currentUrl = page.url();
    if (currentUrl.includes("/reseller/dashboard.php")) {
      return new Response(
        JSON.stringify({
          message: "Login submitted successfully.",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // If neither error message nor dashboard URL is found, return a generic error
    return new Response(
      JSON.stringify({
        message: "Failed to determine login status.",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error submitting login:", error.message);
    return new Response(
      JSON.stringify({
        message: "Failed to submit login.",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
