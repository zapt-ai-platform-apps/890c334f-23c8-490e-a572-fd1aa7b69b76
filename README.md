# New App

New App is a platform where users can earn rewards by completing simple tasks. These tasks can include surveys, polls, watching advertisements, or other simple activities. Users can accumulate points for each task they complete, which can later be redeemed for rewards.

## User Journeys

### 1. Sign Up / Log In

- **Step 1:** Visit the New App homepage.
- **Step 2:** Click on "Sign in with ZAPT".
- **Step 3:** Authenticate using your email or social login providers (Google, Facebook, Apple).
- **Step 4:** Once authenticated, you will be redirected to the home page.

### 2. View Available Tasks

- **Step 1:** On the home page, you will see a list of available tasks.
- **Step 2:** Each task shows its title, description, and the reward points you will earn upon completion.

### 3. Complete a Task

- **Step 1:** Click on a task you wish to complete.
- **Step 2:** A prompt will appear asking for your response or input.
- **Step 3:** Provide the required information and submit your response.
- **Step 4:** A confirmation message will appear indicating the task is completed and points have been added to your account.

### 4. View Rewards Balance

- **Step 1:** Your total rewards are displayed on the home page under your welcome message.
- **Step 2:** As you complete tasks, this total will update to reflect your new balance.

### 5. Redeem Rewards (Future Feature)

- **Note:** Currently, accumulating points is possible, but redeeming rewards will be implemented in a future update.

### 6. Sign Out

- **Step 1:** Click on the "Sign Out" button at the top right corner of the page.
- **Step 2:** You will be signed out and redirected to the login page.

## External API Services

- **Supabase Authentication:** Used for user authentication and managing user sessions.
- **Sentry:** Used for error logging and monitoring to ensure a smooth user experience.

## Environment Variables

- `VITE_PUBLIC_APP_ID`: Your application's public identifier.
- `VITE_PUBLIC_SENTRY_DSN`: Your Sentry Data Source Name for error reporting.
- `VITE_PUBLIC_APP_ENV`: The environment in which the app is running (e.g., development, production).
- `NEON_DB_URL`: Connection string for the Neon PostgreSQL database.

---