# Download Instructions for Local Setup

## Important Security Note
Your .env file contains sensitive credentials and should never be shared or exposed. Here's how to safely get your environment setup for local development:

## Option 1: Download from Replit (Recommended)
1. In your Replit project, go to the file browser
2. Click the three dots menu (⋯) next to your project name
3. Select "Download as zip"
4. Extract the zip file on your local machine
5. The .env file is already configured with your secrets

## Option 2: Manual Setup
If you need to recreate the .env file manually:

### Database Configuration
Your PostgreSQL database is already running on Replit. For local development, you'll need to:
1. Set up a local PostgreSQL instance, OR
2. Use the Replit database remotely (requires network access)

### Required Environment Variables
Check the `.env.example` file I created for the structure. You'll need:

- **Database**: PostgreSQL connection string
- **Gemini API**: Your Google AI API key
- **Firebase**: Project configuration for auth and storage

### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Access your project: `omara-fa9ee`
3. Get your web app configuration from Project Settings
4. For server-side: Generate a new service account key

## Current Status
Your Replit environment already has all secrets configured. The application is fully functional with:
- PostgreSQL database with persistent storage
- Firebase authentication and file storage
- Gemini AI integration for document analysis
- Improved PDF text extraction

## Security Best Practices
- Never commit .env files to version control
- Use different API keys for development/production
- Rotate keys periodically
- Restrict API key permissions where possible

Your AI document analysis platform is ready for deployment or local development!