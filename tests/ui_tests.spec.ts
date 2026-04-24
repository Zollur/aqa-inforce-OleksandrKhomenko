import { test, expect } from "@playwright/test";
import { MainPage } from "../pages/mainPage";
import { BookingPage } from "../pages/BookingPage";

test.describe.configure({ retries: 2 });

const getDates = (testInfo: any, month: number) => {
  const day = testInfo.project.name === "chromium" ? 10 : testInfo.project.name === "firefox" ? 15 : 20;
  const checkInDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/2027`;
  const checkOutDate = `${(day + 2).toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/2027`;
  const checkInYMD = `2027-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  return { checkInDate, checkOutDate, checkInYMD };
};

test("TC-001: Check that the room can be booked with valid data", async ({ page }, testInfo) => {
  test.setTimeout(120000);
  const { checkInDate, checkOutDate } = getDates(testInfo, 1);
  const mainPage = new MainPage(page);
  const bookingPage = new BookingPage(page);

  await expect(async () => {
    await mainPage.goto(page);

    await expect(page.getByRole('heading', { name: "This page couldn't load" })).toBeHidden({ timeout: 1000 });
    await expect(page.getByText("500")).toBeHidden({ timeout: 1000 });

    await mainPage.navbarBookingButton.click();
    await mainPage.checkInField.fill(checkInDate);
    await mainPage.checkOutField.fill(checkOutDate);
    await mainPage.checkAvailabilityButton.click();

    await mainPage.bookRoomNumberN(0);
    await bookingPage.ReserveNowButton.click();
    await bookingPage.FirstnameField.fill("John");
    await bookingPage.LastnameField.fill("Doe");
    await bookingPage.EmailField.fill("john.doe@example.com");
    await bookingPage.PhoneField.fill("+1234567890");
    await bookingPage.ReserveNowButton.click();

    const successMessage = page.getByRole('heading', { name: 'Booking Confirmed' });
    await expect(successMessage).toBeVisible({ timeout: 5000 });
  }).toPass({ timeout: 120000 });
});

test("TC-002: Check that the room can’t be booked with invalid email", async ({ page }, testInfo) => {
  test.setTimeout(120000);
  const { checkInDate, checkOutDate } = getDates(testInfo, 2);
  const mainPage = new MainPage(page);
  const bookingPage = new BookingPage(page);
  
  await expect(async () => {
    await mainPage.goto(page);

    await expect(page.getByRole('heading', { name: "This page couldn't load" })).toBeHidden({ timeout: 1000 });
    await expect(page.getByText("500")).toBeHidden({ timeout: 1000 });

    await mainPage.navbarBookingButton.click();
    await mainPage.checkInField.fill(checkInDate);
    await mainPage.checkOutField.fill(checkOutDate);
    await mainPage.checkAvailabilityButton.click();
    
    await mainPage.bookRoomNumberN(0);
    await bookingPage.ReserveNowButton.click();
    await bookingPage.FirstnameField.fill("John");
    await bookingPage.LastnameField.fill("Doe");
    await bookingPage.EmailField.fill("john.doe");
    await bookingPage.PhoneField.fill("+1234567890");
    await bookingPage.ReserveNowButton.click();
    
    await expect(page.locator("form")).toContainText("must be a well-formed email address", { timeout: 5000 });
  }).toPass({ timeout: 120000 });
});

test("TC-003: Check that the room can’t be booked with invalid phone number", async ({ page }, testInfo) => {
  test.setTimeout(120000);
  const { checkInDate, checkOutDate } = getDates(testInfo, 3);
  const mainPage = new MainPage(page);
  const bookingPage = new BookingPage(page);
  
  await expect(async () => {
    await mainPage.goto(page);

    await expect(page.getByRole('heading', { name: "This page couldn't load" })).toBeHidden({ timeout: 1000 });
    await expect(page.getByText("500")).toBeHidden({ timeout: 1000 });

    await mainPage.navbarBookingButton.click();
    await mainPage.checkInField.fill(checkInDate);
    await mainPage.checkOutField.fill(checkOutDate);
    await mainPage.checkAvailabilityButton.click();
    
    await mainPage.bookRoomNumberN(0);
    await bookingPage.ReserveNowButton.click();
    await bookingPage.FirstnameField.fill("John");
    await bookingPage.LastnameField.fill("Doe");
    await bookingPage.EmailField.fill("john.doe@example.com");
    await bookingPage.PhoneField.fill("+123");
    await bookingPage.ReserveNowButton.click();
    
    await expect(page.locator("form")).toContainText("size must be between 11 and 21", { timeout: 5000 });
  }).toPass({ timeout: 120000 });
});

test("TC-004: Check that the room can’t be booked with empty first and last name", async ({ page }, testInfo) => {
  test.setTimeout(120000);
  const { checkInDate, checkOutDate } = getDates(testInfo, 4);
  const mainPage = new MainPage(page);
  const bookingPage = new BookingPage(page);
  
  await expect(async () => {
    await mainPage.goto(page);

    await expect(page.getByRole('heading', { name: "This page couldn't load" })).toBeHidden({ timeout: 1000 });
    await expect(page.getByText("500")).toBeHidden({ timeout: 1000 });

    await mainPage.navbarBookingButton.click();
    await mainPage.checkInField.fill(checkInDate);
    await mainPage.checkOutField.fill(checkOutDate);
    await mainPage.checkAvailabilityButton.click();
    
    await mainPage.bookRoomNumberN(0);
    await bookingPage.ReserveNowButton.click();
    await bookingPage.EmailField.fill("john.doe@example.com");
    await bookingPage.PhoneField.fill("+1234567890");
    await bookingPage.ReserveNowButton.click();
    
    await expect(page.locator("form")).toContainText("Lastname should not be blank", { timeout: 5000 });
    await expect(page.locator("form")).toContainText("Firstname should not be blank", { timeout: 5000 });
    await expect(page.locator("form")).toContainText("size must be between 3 and 18", { timeout: 5000 });
    await expect(page.locator("form")).toContainText("size must be between 3 and 30", { timeout: 5000 });
  }).toPass({ timeout: 120000 });
});

test("TC-005: Check that the earlier booked rooms show as unavailable", async ({ page }, testInfo) => {
  test.setTimeout(120000);
  const { checkInDate, checkOutDate, checkInYMD } = getDates(testInfo, 5);
  const mainPage = new MainPage(page);
  const bookingPage = new BookingPage(page);

  let bookedRoomUrl: string | null = null;

  await expect(async () => {
    await mainPage.goto(page);

    await expect(page.getByRole('heading', { name: "This page couldn't load" })).toBeHidden({ timeout: 1000 });
    await expect(page.getByText("500")).toBeHidden({ timeout: 1000 });

    await mainPage.navbarBookingButton.click();
    await mainPage.checkInField.fill(checkInDate);
    await mainPage.checkOutField.fill(checkOutDate);
    await mainPage.checkAvailabilityButton.click();

    const bookButtons = page.locator(`a:has-text("Book now")[href*="${checkInYMD}"]`);
    await expect(bookButtons.first()).toBeVisible();

    bookedRoomUrl = await bookButtons.first().getAttribute("href");

    await bookButtons.first().click();
    await bookingPage.ReserveNowButton.click();
    await bookingPage.FirstnameField.fill("John");
    await bookingPage.LastnameField.fill("Doe");
    await bookingPage.EmailField.fill("john.doe@example.com");
    await bookingPage.PhoneField.fill("+1234567890");
    await bookingPage.ReserveNowButton.click();

    await expect(page.getByRole("heading", { name: "Booking Confirmed" })).toBeVisible({ timeout: 5000 });
  }).toPass({ timeout: 120000 });

  await mainPage.goto(page);
  await mainPage.navbarBookingButton.click();
  await mainPage.checkInField.fill(checkInDate);
  await mainPage.checkOutField.fill(checkOutDate);

  await expect(async () => {
    await mainPage.checkAvailabilityButton.click();
    
    const specificRoomButton = page.locator(`a:has-text("Book now")[href="${bookedRoomUrl}"]`);
    await expect(specificRoomButton).toBeHidden({ timeout: 2000 });
  }).toPass({ timeout: 30000 });
});