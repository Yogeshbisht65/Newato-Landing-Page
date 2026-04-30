# Newato Waitlist Emails

When the local Vite server is running, Early Access submissions are saved here as a fallback:

- `emails.json`
- `emails.csv`

For production on Vercel, configure MongoDB environment variables:

- `MONGODB_URI`
- `MONGODB_DB` (optional, defaults to `newato`)
- `MONGODB_COLLECTION` (optional, defaults to `waitlist`)

The browser also keeps a local fallback copy in `localStorage` under `newatoWaitlistEmails`.
