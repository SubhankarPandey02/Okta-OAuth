# 🎓 Student Guide: OAuth 2.0 Authorization Code Flow

Welcome! This guide will help you understand and set up the OAuth 2.0 Authorization Code Flow demo application.

## 📚 What You'll Learn

By working with this application, you will understand:

1. **OAuth 2.0 Fundamentals**: What OAuth is and why it's used
2. **Authorization Code Flow**: The most secure OAuth flow for web applications
3. **Security Concepts**: CSRF protection, token types, and secure credential handling
4. **Practical Implementation**: How to integrate OAuth with a real Identity Provider (Okta)

## 🔍 What is OAuth 2.0?

**OAuth 2.0** is an authorization framework that allows applications to obtain limited access to user accounts on an HTTP service. Instead of sharing passwords, OAuth uses **access tokens** to grant access.

### Real-World Example

Think of OAuth like a hotel key card:
- You check in (authenticate) at the front desk
- You receive a key card (access token)
- The key card grants access to specific areas (scopes)
- The key card expires after checkout (token expiration)
- You never give the hotel your house keys (password)

## 🔄 Authorization Code Flow Overview

The Authorization Code Flow has 5 main steps:

```
1. User clicks "Login" → App redirects to Identity Provider (Okta)
2. User authenticates and grants consent
3. Identity Provider redirects back with authorization code
4. App exchanges code for access token (server-side)
5. App uses access token to access protected resources
```

### Why This Flow?

- **Secure**: Client secret never exposed to browser
- **Standard**: Used by Google, Facebook, GitHub, etc.
- **Flexible**: Supports refresh tokens for long-lived access

## 🛠️ Setup Instructions

### Step 1: Install Node.js

1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Install the LTS (Long Term Support) version
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Get the Code

**Option A: Clone from GitHub** (if your instructor shared a repository)
```bash
git clone <repository-url>
cd oauth-demo-app
```

**Option B: Download ZIP**
1. Download the ZIP file from your instructor
2. Extract it to a folder
3. Open terminal/command prompt in that folder

### Step 3: Install Dependencies

```bash
npm install
```

This installs the required packages:
- **express**: Web server
- **axios**: HTTP client
- **dotenv**: Environment variable manager
- **express-session**: Session management

### Step 4: Create Your Okta Account

1. Go to [developer.okta.com](https://developer.okta.com/)
2. Click "Sign Up" (it's free!)
3. Fill in your details and verify your email
4. **Save your Okta domain** (e.g., `dev-12345678.okta.com`)

### Step 5: Create an Okta Application

1. Log in to Okta Admin Console
2. Go to **Applications** → **Applications**
3. Click **Create App Integration**
4. Select:
   - Sign-in method: **OIDC - OpenID Connect**
   - Application type: **Web Application**
5. Click **Next**
6. Configure:
   - **App name**: `My OAuth Demo`
   - **Grant type**: Check **Authorization Code**
   - **Sign-in redirect URIs**: `http://localhost:3000/callback`
   - **Sign-out redirect URIs**: `http://localhost:3000`
7. Click **Save**
8. **Copy your Client ID and Client Secret** (you'll need these!)

### Step 6: Configure Environment Variables

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```
   
   On Windows:
   ```bash
   copy .env.example .env
   ```

2. Open `.env` in a text editor (Notepad, VS Code, etc.)

3. Fill in your values:
   ```env
   OKTA_DOMAIN=dev-12345678.okta.com
   OKTA_CLIENT_ID=your-client-id-here
   OKTA_CLIENT_SECRET=your-client-secret-here
   REDIRECT_URI=http://localhost:3000/callback
   SESSION_SECRET=make-this-a-random-string
   PORT=3000
   ```

4. **Important**: Replace all placeholder values with your actual credentials!

### Step 7: Run the Application

```bash
npm start
```

You should see:
```
🚀 OAuth Demo Server running on http://localhost:3000
```

### Step 8: Test It Out!

1. Open your browser to `http://localhost:3000`
2. Click "Start OAuth Flow (Login)"
3. Log in with your Okta credentials
4. Watch the magic happen! ✨

## 🎯 Learning Exercises

### Exercise 1: Trace the Flow

As you run the demo, answer these questions:

1. What parameters are included in the authorization URL? (Check the logs)
2. What is the purpose of the `state` parameter?
3. How long is the authorization code valid?
4. What's the difference between an access token and an ID token?

### Exercise 2: Inspect the Tokens

1. After logging in, copy your access token
2. Go to [jwt.io](https://jwt.io)
3. Paste the token and decode it
4. What information does it contain?

### Exercise 3: Security Analysis

Think about these security questions:

1. Why is the authorization code exchanged on the server-side?
2. What would happen if someone intercepted the authorization code?
3. Why do we use a random `state` parameter?
4. What happens if you try to reuse an authorization code?

### Exercise 4: Modify the Scopes

1. Open `server.js`
2. Find the `/login` endpoint
3. Change the scope from `openid profile email` to just `openid profile`
4. Restart the server and test
5. What information is missing from the user profile?

## 🔐 Security Best Practices

### DO ✅

- **Keep credentials secret**: Never commit `.env` to Git
- **Use HTTPS in production**: Required for OAuth in production
- **Validate state parameter**: Prevents CSRF attacks
- **Store tokens securely**: Use server-side sessions
- **Use short-lived tokens**: Implement token refresh

### DON'T ❌

- **Share your Client Secret**: It's like a password
- **Store tokens in localStorage**: Vulnerable to XSS attacks
- **Use implicit flow**: Authorization Code Flow is more secure
- **Skip state validation**: Opens CSRF vulnerabilities
- **Hardcode credentials**: Always use environment variables

## 🐛 Troubleshooting

### "Okta credentials not configured"

**Problem**: Your `.env` file is not set up correctly.

**Solution**: 
1. Make sure `.env` file exists (not `.env.example`)
2. Check that all values are filled in
3. Restart the server after changing `.env`

### "Invalid redirect URI"

**Problem**: The redirect URI in your code doesn't match Okta configuration.

**Solution**: 
1. Check Okta app settings
2. Ensure redirect URI is exactly: `http://localhost:3000/callback`
3. No trailing slashes!

### "Port 3000 already in use"

**Problem**: Another application is using port 3000.

**Solution**: 
1. Change `PORT=3001` in your `.env` file
2. Update redirect URI in Okta to `http://localhost:3001/callback`
3. Restart the server

### "Cannot GET /callback"

**Problem**: You're accessing the callback URL directly.

**Solution**: Always start the flow by clicking "Start OAuth Flow" button.

## 📖 Additional Resources

### OAuth 2.0 Concepts
- [OAuth 2.0 Simplified](https://aaronparecki.com/oauth-2-simplified/)
- [OAuth 2.0 Playground](https://www.oauth.com/playground/)
- [Understanding OAuth 2.0](https://auth0.com/intro-to-iam/what-is-oauth-2)

### Okta Documentation
- [Okta Developer Docs](https://developer.okta.com/docs/)
- [OAuth 2.0 and OpenID Connect Overview](https://developer.okta.com/docs/concepts/oauth-openid/)

### Video Tutorials
- [OAuth 2.0 Explained](https://www.youtube.com/watch?v=996OiexHze0)
- [What is OAuth Really All About?](https://www.youtube.com/watch?v=t4-416mg6iU)

## 💡 Next Steps

After mastering this demo, try:

1. **Add PKCE**: Implement Proof Key for Code Exchange for extra security
2. **Refresh Tokens**: Implement token refresh functionality
3. **Different Scopes**: Experiment with different OAuth scopes
4. **Multiple Providers**: Try integrating Google or GitHub OAuth
5. **Production Deployment**: Deploy to a cloud platform with HTTPS

## 🤝 Getting Help

If you're stuck:

1. **Check the logs**: The application provides detailed logging
2. **Review the README**: Comprehensive setup instructions
3. **Ask your instructor**: They're there to help!
4. **Check Okta docs**: [developer.okta.com](https://developer.okta.com/)

## 🎉 Congratulations!

You've successfully set up and run an OAuth 2.0 Authorization Code Flow application! This is a fundamental skill for modern web development.

---

**Happy Learning! 🚀**

Remember: OAuth might seem complex at first, but with practice, it becomes second nature. Keep experimenting!
