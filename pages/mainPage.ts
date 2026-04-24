import { Page, Locator } from "@playwright/test";

export class MainPage {
  page: Page;
  navbarBookingButton: Locator;
  checkInField: Locator;
  checkOutField: Locator;
  checkAvailabilityButton: Locator;
  bookRoomButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navbarBookingButton = page
      .locator("#navbarNav")
      .getByRole("link", { name: "Booking" });
    this.bookRoomButton = page.getByRole("link", { name: "Book now", exact: true });
    this.checkInField = page.getByRole("textbox").first();
    this.checkOutField = page.getByRole("textbox").nth(1);
    this.checkAvailabilityButton = page.getByRole("button", {
      name: "Check Availability",
    });
  }

  async goto(page: Page) {
    await page.goto("https://automationintesting.online/");
  }

  async bookRoomNumberN(n: number) {
    await this.bookRoomButton.nth(n).click();
  }
}
