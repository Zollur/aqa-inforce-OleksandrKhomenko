import { Page, Locator } from "@playwright/test";

export class BookingPage {
  page: Page;
  ReserveNowButton: Locator;
  FirstnameField: Locator;
  LastnameField: Locator;
  EmailField: Locator;
  PhoneField: Locator;

  constructor(page: Page) {
    this.page = page;
    this.ReserveNowButton = page.getByRole("button", { name: "Reserve Now" });
    this.FirstnameField = page.getByRole("textbox", { name: "Firstname" });
    this.LastnameField = page.getByRole("textbox", { name: "Lastname" });
    this.EmailField = page.getByRole("textbox", { name: "Email" });
    this.PhoneField = page.getByRole("textbox", { name: "Phone" });
  }
}
