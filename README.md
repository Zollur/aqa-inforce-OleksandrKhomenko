# 🧪 AQA InForce — Oleksandr Khomenko

[![Playwright Tests](https://github.com/Zollur/aqa-inforce-OleksandrKhomenko/actions/workflows/playwright.yml/badge.svg)](https://github.com/Zollur/aqa-inforce-OleksandrKhomenko/actions/workflows/playwright.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-v16+-339933?logo=node.js&logoColor=white)

Automated test suite for the **[Restful Booker Platform](https://automationintesting.online/)** demo application, built as part of the InForce AQA Task.

The project covers both **API** and **UI E2E** testing using **Playwright (TypeScript)** and follows the **Page Object Model (POM)** pattern.

---

## 📁 Project Structure

```
aqa-inforce-OleksandrKhomenko/
├── pages/
│   ├── BookingPage.ts       # Locators & methods for the Booking flow
│   └── mainPage.ts          # Locators & methods for the Main page
├── tests/
│   ├── api_tests.spec.ts    # API Tests (Admin & User interactions)
│   └── ui_tests.spec.ts     # UI E2E Tests (User booking flow)
├── .github/
│   └── workflows/           # CI/CD pipeline (GitHub Actions)
├── test-cases.txt           # Manual Test Cases documentation
├── playwright.config.ts     # Playwright configuration
├── package.json
└── README.md
```

---

## ✅ Test Scenarios

### UI Tests — `ui_tests.spec.ts`

| ID | Scenario |
|----|----------|
| TC-001 | Book a room with **valid** data |
| TC-002 | Prevent booking with an **invalid email** |
| TC-003 | Prevent booking with an **invalid phone number** |
| TC-004 | Prevent booking with **empty first/last name** |
| TC-005 | Verify that previously booked dates show as **Unavailable** |

### API Tests — `api_tests.spec.ts`

All API interactions use `test.step()` for clear **AAA (Arrange–Act–Assert)** visibility in reports.

| # | Flow |
|---|------|
| 1 | **Create & Verify** — Create a Room via Admin API → verify it appears on User API |
| 2 | **Book & Verify** — Book a room via User API → verify it shows as *Unavailable* on Admin API |
| 3 | **Edit & Verify** — Edit Room via Admin API → verify changes reflect on User API |
| 4 | **Delete & Verify** — Delete Room via Admin API → verify it's removed from User API |

---

## ⭐ Key Highlights

- **Page Object Model (POM)** — clean separation of UI locators and test logic
- **Playwright API RequestContext** — robust API testing with cookie-based auth for Admin endpoints
- **Dynamic data generation** — unique room names and dates prevent state collision in parallel runs
- **`test.step()` usage** — all API flows broken into logical steps for readable HTML reports
- **Cross-browser** — tests run on Chromium, Firefox, and WebKit

---

## 🛠️ Setup & Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- npm (bundled with Node.js)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/Zollur/aqa-inforce-OleksandrKhomenko.git
cd aqa-inforce-OleksandrKhomenko

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install --with-deps
```

---

## 🚀 Running the Tests

```bash
# Run all tests (API + UI)
npx playwright test

# Run only API tests
npx playwright test tests/api_tests.spec.ts

# Run only UI tests
npx playwright test tests/ui_tests.spec.ts

# Run in headed mode (visible browser)
npx playwright test --headed

# View the HTML report after a run
npx playwright show-report
```

---

## 📄 Manual Test Cases

Manual test case documentation is located in [`test-cases.txt`](./test-cases.txt) and covers:

1. Room booking with valid data
2. Booking prevention with invalid inputs (Email, Phone, Empty fields)
3. Verification that previously booked dates appear as unavailable

---

## 👤 Author

**Oleksandr Khomenko**
[GitHub](https://github.com/Zollur) · Built for the InForce AQA Task
