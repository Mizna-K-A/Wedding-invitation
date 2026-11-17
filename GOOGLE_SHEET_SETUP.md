# Google Sheet Setup Guide — Guest Attendance Counter

This website has a built-in guest attendance form where guests **just enter their name** to confirm attendance. Each submission records the guest name into your private Google Sheet and updates the live guest count on the website.

---

## ⚡ Quick 2-Minute Setup

### Step 1: Create a Google Sheet
1. Open your browser and go to [sheets.new](https://sheets.new) (or open your existing Google Sheet).
2. Name the sheet e.g. **"Ajmal & Muhsina Wedding Guests"**.

### Step 2: Open Google Apps Script
1. In the top Google Sheets menu, click:  
   **Extensions** ➔ **Apps Script**.
2. A new browser tab with the Apps Script editor will open.

### Step 3: Paste the Script
1. Select and delete any code inside the `Code.gs` file.
2. Open [`google-apps-script.js`](./google-apps-script.js) from this repository, copy all the code, and paste it into `Code.gs`.
3. Click the **Save** icon (💾) at the top of the editor.

### Step 4: Deploy as a Web App
1. Click the blue **Deploy** button (top right) ➔ select **New deployment**.
2. Click the gear icon (**⚙️**) next to "Select type" and choose **Web app**.
3. Fill in these settings:
   - **Description**: `Wedding Guest Counter`
   - **Execute as**: `Me (<your-email>)`
   - **Who has access**: **`Anyone`** *(⚠️ IMPORTANT: Must be "Anyone" so wedding guests can submit without signing into Google)*
4. Click **Deploy**.
5. Google will ask you to authorize access:
   - Click **Authorize access**.
   - Choose your Google account.
   - Click **Advanced** (at the bottom of the prompt).
   - Click **Go to Untitled project (unsafe)**.
   - Click **Allow**.
6. Google will now display your **Web app URL** (it ends with `/exec`). Click **Copy**.

### Step 5: Paste the URL into `script.js`
1. Open [`script.js`](./script.js) in your project.
2. At line 166, paste your URL between the quotes:
   ```javascript
   const GOOGLE_SHEET_SCRIPT_URL = "https://script.google.com/macros/s/AKfycb.../exec";
   ```
3. Save the file. That's it!

---

## 📋 What the Google Sheet Records

Each time a guest enters their name on the website, a new row is automatically added:

| Sl No. | Timestamp (IST) | Guest Name |
| :---: | :---: | :--- |
| 1 | 27 Dec 2026, 10:15:30 AM | Ameer & Family |
| 2 | 27 Dec 2026, 10:18:42 AM | Shameera Ashraf |
| 3 | 27 Dec 2026, 11:02:15 AM | ... |

- **Dedicated Guest Count Page**: The total count and attendee names are kept private on [`guest-count.html`](./guest-count.html) (accessible via the footer link on the main page), keeping the main invitation clean and personal.
- **Live Counter**: The counter on `guest-count.html` automatically syncs with the total number of guests recorded in the sheet!
- **Local Fallback**: If the URL isn't configured yet, the site works in offline demo mode using local browser storage so you can test it immediately.

