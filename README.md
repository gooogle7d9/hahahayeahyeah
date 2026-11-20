# Mood Campus — English prototype

A browser-based school wellbeing prototype with an interactive user flow map.

## Run locally
Open `index.html`, or use the VS Code Live Server extension.

## Publish with GitHub Pages
1. Create a public GitHub repository named `mood-campus-app`.
2. Upload `index.html`, `style.css`, `app.js`, and `README.md` to the repository root.
3. Open Settings > Pages.
4. Under Build and deployment, choose Deploy from a branch, `main`, and `/(root)`.
5. Save and wait several minutes for the site URL.

## Prototype limitations
- Data is stored only in browser localStorage.
- Staff records and referral alerts are demonstration data.
- EEG connection is simulated. A real device requires the manufacturer's SDK and a reviewed consent process.
- Replace `counsellor@school.edu.hk` with the school's approved support channel.
- GitHub Pages is not suitable for storing identifiable student wellbeing or health records. A production version requires authentication, role-based access, encrypted storage, audit logs, retention rules, safeguarding procedures and a privacy impact assessment.
- A seven-day rule should create a human-review alert, not an automatic diagnosis.

## Privacy and access model in this revision
- Teacher role: anonymous class-level averages only; minimum 10 responses before charts display.
- Social worker role: receives only a student-authorised support signal under a random alias; diary text is never displayed.
- Student diary: local browser storage in this prototype. Do not use this design on shared devices for real records.
- Seven consecutive very-low entries: private graduated-consent prompt, not automatic referral.
- Student trust feature: “Preview what my teacher can see.”
