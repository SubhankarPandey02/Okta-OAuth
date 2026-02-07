# 🔐 OAuth 2.0 Authorization Code Flow Demo

An interactive educational application demonstrating the OAuth 2.0 Authorization Code Flow using Okta as the Identity Provider. Perfect for classroom demonstrations and learning OAuth concepts.

![OAuth Flow](https://img.shields.io/badge/OAuth-2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Okta Setup](#okta-setup)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Using the Demo](#using-the-demo)
- [Understanding the Flow](#understanding-the-flow)
- [Sharing with Students](#sharing-with-students)
- [GitHub Setup](#github-setup)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This application provides a step-by-step visualization of the OAuth 2.0 Authorization Code Flow, showing:
- Authorization request construction
- User authentication and consent
- Authorization code callback
- Token exchange
- Protected resource access

Each step is clearly displayed with real-time logging, making it perfect for teaching OAuth concepts.

## ✨ Features

- **Visual Step-by-Step Flow**: Interactive UI showing all 5 OAuth flow phases
- **Real-Time Logging**: Detailed logs of HTTP requests and responses
- **Token Display**: View authorization codes, access tokens, and ID tokens
- **User Profile Display**: Shows authenticated user information
- **Educational Focus**: Clear explanations and color-coded status indicators
- **Classroom Ready**: Professional design optimized for projection

## 📦 Prerequisites

Before you begin, ensure you have:

1. **Node.js** (version 14 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **Okta Developer Account** (free)
   - Sign up at [developer.okta.com](https://developer.okta.com/)

3. **Git** (optional, for version control)
   - Download from [git-scm.com](https://git-scm.com/)

## 🔧 Okta Setup

### Step 1: Create an Okta Developer Account

1. Go to [developer.okta.com](https://developer.okta.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address
4. Note your **Okta domain** (e.g., `dev-12345678.okta.com`)

### Step 2: Create an Application in Okta

1. Log in to your Okta Admin Console
2. Navigate to **Applications** → **Applications**
3. Click **Create App Integration**
4. Select:
   - **Sign-in method**: OIDC - OpenID Connect
   - **Application type**: Web Application
5. Click **Next**

### Step 3: Configure Application Settings

1. **App integration name**: `OAuth Demo App` (or any name you prefer)
2. **Grant type**: Check **Authorization Code**
3. **Sign-in redirect URIs**: 
   ```
   http://localhost:3000/callback
   ```
4. **Sign-out redirect URIs**: 
   ```
   http://localhost:3000
   ```
5. **Controlled access**: Select "Allow everyone in your organization to access"
6. Click **Save**

### Step 4: Get Your Credentials

After creating the application, you'll see:
- **Client ID**: Copy this value
- **Client Secret**: Click to reveal and copy this value

**Important**: Keep these credentials secure!

## 🚀 Installation

### 1. Clone or Download the Repository

```bash
# If using Git
git clone <repository-url>
cd oauth-demo-app

# Or download and extract the ZIP file
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web server framework
- `dotenv` - Environment variable management
- `axios` - HTTP client for API requests
- `express-session` - Session management

### 3. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your Okta credentials:
   ```env
   OKTA_DOMAIN=dev-12345678.okta.com
   OKTA_CLIENT_ID=your-client-id-here
   OKTA_CLIENT_SECRET=your-client-secret-here
   REDIRECT_URI=http://localhost:3000/callback
   SESSION_SECRET=your-random-secret-key-change-this
   PORT=3000
   ```

3. Replace the placeholder values:
   - `OKTA_DOMAIN`: Your Okta domain (without `https://`)
   - `OKTA_CLIENT_ID`: Client ID from Step 4 above
   - `OKTA_CLIENT_SECRET`: Client Secret from Step 4 above
   - `SESSION_SECRET`: Generate a random string (e.g., use a password generator)

## ▶️ Running the Application

### Start the Server

```bash
npm start
```

You should see:
```
🚀 OAuth Demo Server running on http://localhost:3000

📋 Configuration:
   Okta Domain: dev-12345678.okta.com
   Client ID: 0oa...
   Redirect URI: http://localhost:3000/callback
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 🎓 Using the Demo

### For Instructors

1. **Start the Demo**: Click "Start OAuth Flow (Login)"
2. **Explain Each Step**: As the flow progresses, explain what's happening:
   - **Step 1**: Show the authorization URL construction in the logs
   - **Step 2**: Demonstrate user authentication on Okta's login page
   - **Step 3**: Show the authorization code in the callback
   - **Step 4**: Explain the token exchange process
   - **Step 5**: Display the user information retrieved with the access token

3. **Show the Logs**: Point out the detailed logging panel showing:
   - HTTP requests and responses
   - State parameter for CSRF protection
   - Token types and expiration

4. **Discuss Security**: Highlight security features:
   - State parameter prevents CSRF attacks
   - Authorization code is single-use
   - Client secret is never exposed to the browser
   - Tokens are stored server-side in sessions

### For Students

Students can follow along by:
1. Setting up their own Okta developer account
2. Cloning the repository
3. Configuring their own credentials
4. Running the demo locally

See [STUDENT_GUIDE.md](STUDENT_GUIDE.md) for detailed student instructions.

## 🔍 Understanding the Flow

### Step 1: Authorization Request
```
User clicks "Login" → App redirects to Okta
URL includes: client_id, redirect_uri, scope, state, response_type=code
```

### Step 2: User Authentication
```
User enters credentials on Okta's login page
User grants consent to requested scopes (openid, profile, email)
```

### Step 3: Authorization Code Callback
```
Okta redirects back to: http://localhost:3000/callback?code=...&state=...
App validates state parameter (CSRF protection)
```

### Step 4: Token Exchange
```
App sends POST request to Okta's token endpoint
Exchanges authorization code for tokens
Receives: access_token, id_token, refresh_token
```

### Step 5: Access Protected Resource
```
App uses access_token to call Okta's userinfo endpoint
Retrieves user profile information
Displays user data in the UI
```

## 📤 Sharing with Students

### Option 1: Share as ZIP File

1. Create a ZIP file of the project (exclude `node_modules` and `.env`)
2. Share via email, learning management system, or cloud storage
3. Include the [STUDENT_GUIDE.md](STUDENT_GUIDE.md) file

### Option 2: Share via GitHub (Recommended)

See [GitHub Setup](#github-setup) section below.

### Option 3: Live Demo Only

If you prefer not to share the code:
1. Run the demo during class
2. Share screenshots or screen recordings
3. Provide the [STUDENT_GUIDE.md](STUDENT_GUIDE.md) for reference

## 🐙 GitHub Setup

### Creating a GitHub Repository

1. **Create a new repository on GitHub**:
   - Go to [github.com](https://github.com)
   - Click the "+" icon → "New repository"
   - Name it `oauth-demo-app` or similar
   - Choose "Public" to share with students
   - Don't initialize with README (we already have one)
   - Click "Create repository"

2. **Push your code to GitHub**:
   ```bash
   # Initialize git (if not already done)
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit: OAuth 2.0 Authorization Code Flow Demo"
   
   # Add remote (replace with your repository URL)
   git remote add origin https://github.com/yourusername/oauth-demo-app.git
   
   # Push to GitHub
   git push -u origin main
   ```

3. **Share with students**:
   - Share the repository URL: `https://github.com/yourusername/oauth-demo-app`
   - Students can clone it: `git clone <repository-url>`

### Important: Security Considerations

**Never commit your `.env` file!** The `.gitignore` file already excludes it, but double-check:

```bash
# Verify .env is not tracked
git status

# If .env appears, remove it
git rm --cached .env
git commit -m "Remove .env from tracking"
```

Students will need to create their own `.env` file with their Okta credentials.

## 🔧 Troubleshooting

### "Okta credentials not configured" Warning

**Solution**: Check your `.env` file and ensure all values are set correctly.

### "Invalid state parameter" Error

**Solution**: This is a security feature. Try clearing your browser cookies or using an incognito window.

### "Token exchange failed" Error

**Solution**: 
- Verify your `OKTA_CLIENT_SECRET` is correct
- Check that your redirect URI in Okta matches exactly: `http://localhost:3000/callback`

### Port Already in Use

**Solution**: Change the `PORT` in your `.env` file to a different port (e.g., 3001).

### Cannot Access Application

**Solution**: 
- Ensure the server is running (`npm start`)
- Check that you're accessing `http://localhost:3000` (not `https`)
- Try a different browser

## 📚 Additional Resources

- [OAuth 2.0 Specification](https://oauth.net/2/)
- [Okta Developer Documentation](https://developer.okta.com/docs/)
- [Authorization Code Flow Explained](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow)

## 📝 License

MIT License - feel free to use this for educational purposes!

## 🤝 Contributing

This is an educational project. Feel free to fork and modify for your teaching needs!

---

**Happy Teaching! 🎓**

For questions or issues, please refer to the [STUDENT_GUIDE.md](STUDENT_GUIDE.md) or create an issue on GitHub.
