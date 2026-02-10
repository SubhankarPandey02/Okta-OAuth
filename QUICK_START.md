 # 🚀 Quick Start Guide

## For Instructors

### 1. First-Time Setup (5 minutes)

1. **Install Node.js**: Download from [nodejs.org](https://nodejs.org/)

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Okta** (one-time):
   - Create account at [developer.okta.com](https://developer.okta.com/)
   - Create a new Web Application
   - Copy Client ID and Client Secret

4. **Configure environment**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Okta credentials

5. **Run the app**:
   ```bash
   npm start
   ```

6. **Open browser**: `http://localhost:3000`

### 2. Running the Demo

1. Click **"Start OAuth Flow (Login)"**
2. Point out the authorization URL in the logs
3. Log in with your Okta credentials
4. Show each step completing in the UI
5. Highlight the tokens and user information
6. Explain the security features (state parameter, etc.)

### 3. Sharing with Students

**Option A: GitHub** (Recommended)
```bash
git init
git add .
git commit -m "OAuth demo app"
git remote add origin <your-repo-url>
git push -u origin main
```

**Option B: ZIP File**
- Share the entire folder (students will need to run `npm install`)
- Include the STUDENT_GUIDE.md

**Important**: Students must create their own Okta accounts and `.env` files!

---

## For Students

### Quick Setup

1. **Install Node.js** from [nodejs.org](https://nodejs.org/)

2. **Get the code**:
   ```bash
   git clone <repository-url>
   cd oauth-demo-app
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Create Okta account**: [developer.okta.com](https://developer.okta.com/)

5. **Create Okta app**:
   - Applications → Create App Integration
   - OIDC → Web Application
   - Redirect URI: `http://localhost:3000/callback`

6. **Configure**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your credentials

7. **Run**:
   ```bash
   npm start
   ```

8. **Test**: Open `http://localhost:3000`

📖 **See [STUDENT_GUIDE.md](STUDENT_GUIDE.md) for detailed instructions and learning exercises!**

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Okta credentials not configured" | Check your `.env` file |
| "Port already in use" | Change `PORT` in `.env` |
| "Invalid redirect URI" | Must be exactly `http://localhost:3000/callback` |
| Dependencies won't install | Update Node.js to latest LTS version |

---

## What's Included

- ✅ Complete OAuth 2.0 Authorization Code Flow implementation
- ✅ Interactive step-by-step visualization
- ✅ Real-time logging of HTTP requests/responses
- ✅ Token display (access token, ID token)
- ✅ User profile display
- ✅ Comprehensive documentation
- ✅ Student learning guide with exercises
- ✅ Production-ready code structure

---

**Need help?** Check [README.md](README.md) for detailed documentation!
