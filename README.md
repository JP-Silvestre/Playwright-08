

## Setup

1. Install Node.js.
2. Install project dependencies:

   ```bash
   npm install
   ```

3. Install the Playwright browsers:

   ```bash
   npx playwright install
   ```

## Run the tests

Run all tests in the configured browsers:

```bash
npx playwright test
```

Run tests in one browser:

```bash
npx playwright test --project=chromium
```

To open the HTML test report:

```bash
npx playwright show-report
```
