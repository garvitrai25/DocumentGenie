# How to Download Your AI Document Analysis Platform

## Method 1: Download as ZIP (Recommended)

1. **In Replit**: Click the three dots menu (⋯) in the file explorer
2. **Select "Download as ZIP"** - this will download the entire project
3. **Extract the ZIP file** on your computer

## Method 2: Clone with Git

1. **Get the Git URL**: In Replit, go to the Version Control tab and copy the repository URL
2. **Clone locally**: Run `git clone <repository-url>` on your local machine

## Setting Up Locally

After downloading, you'll need to:

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory with:
```
GEMINI_API_KEY=your_gemini_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
```

### 3. Configure Firebase (for production)
- Set up Firebase Admin SDK credentials
- Configure Firebase Storage bucket
- Update server/services/firebase.ts with proper admin credentials

### 4. Run the Application
```bash
npm run dev
```

## Project Structure

- `client/` - React frontend application
- `server/` - Express.js backend API
- `shared/` - Shared TypeScript types and schemas
- `components.json` - ShadCN UI configuration
- `package.json` - Dependencies and scripts

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, ShadCN UI
- **Backend**: Express.js, Node.js
- **Authentication**: Firebase Auth
- **AI**: Google Gemini API
- **File Processing**: PDF parsing, text chunking
- **Build Tools**: Vite, ESBuild

## Next Steps for Production

1. Set up proper Firebase Admin SDK with service account
2. Configure PostgreSQL database (replace in-memory storage)
3. Set up file storage (Firebase Storage or cloud provider)
4. Add proper error handling and logging
5. Implement rate limiting and security measures
6. Deploy frontend and backend separately

Your Strategic Insight platform is fully functional and ready for further development!