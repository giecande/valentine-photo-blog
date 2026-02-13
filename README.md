# Valentine's Day Photo Blog

A simple photo blog website where only the admin can upload photos, but everyone can view them.

## Setup

1. Install dependencies:
```
npm install
```

2. Configure admin password in `.env` file:
```
ADMIN_PASSWORD=your_secure_password
PORT=3000
```

3. Start the server:
```
npm start
```

4. Open browser to `http://localhost:3000`

## Features

- Admin can upload up to 10 photos at once
- Only admin can delete photos
- Everyone can view the photo gallery
- Photos are stored on the server
- Responsive design for mobile and desktop

## Admin Access

Click "Admin Login" button and enter the password from your `.env` file.

## Deployment

To make this accessible online, you can deploy to:
- Heroku
- Railway
- Render
- DigitalOcean
- AWS/Azure/GCP

Make sure to set the `ADMIN_PASSWORD` environment variable on your hosting platform.
