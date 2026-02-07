require('dotenv').config();
const express = require('express');
const session = require('express-session');
const axios = require('axios');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Okta Configuration
const OKTA_DOMAIN = process.env.OKTA_DOMAIN;
const CLIENT_ID = process.env.OKTA_CLIENT_ID;
const CLIENT_SECRET = process.env.OKTA_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:3000/callback';

// Helper function to generate random state
function generateState() {
  return crypto.randomBytes(32).toString('hex');
}

// ============================================
// STEP 1: Initiate Authorization Request
// ============================================
app.get('/login', (req, res) => {
  console.log('\n=== STEP 1: Authorization Request ===');
  
  // Generate and store state for CSRF protection
  const state = generateState();
  req.session.oauthState = state;
  
  // Build authorization URL
  const authorizationUrl = `https://${OKTA_DOMAIN}/oauth2/default/v1/authorize?` +
    `client_id=${CLIENT_ID}&` +
    `response_type=code&` +
    `scope=openid profile email&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `state=${state}`;
  
  console.log('Generated State:', state);
  console.log('Authorization URL:', authorizationUrl);
  console.log('Redirecting user to Okta for authentication...\n');
  
  // Redirect user to Okta
  res.redirect(authorizationUrl);
});

// ============================================
// STEP 2 & 3: Handle Callback and Exchange Code for Tokens
// ============================================
app.get('/callback', async (req, res) => {
  console.log('\n=== STEP 2: Authorization Code Callback ===');
  
  const { code, state } = req.query;
  
  console.log('Received Authorization Code:', code);
  console.log('Received State:', state);
  console.log('Stored State:', req.session.oauthState);
  
  // Validate state parameter (CSRF protection)
  if (state !== req.session.oauthState) {
    console.error('State mismatch! Possible CSRF attack.');
    return res.status(400).send('Invalid state parameter');
  }
  
  console.log('State validation successful!');
  
  // ============================================
  // STEP 3: Exchange Authorization Code for Tokens
  // ============================================
  console.log('\n=== STEP 3: Token Exchange ===');
  
  try {
    const tokenUrl = `https://${OKTA_DOMAIN}/oauth2/default/v1/token`;
    
    // Prepare token request
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    });
    
    console.log('Token Endpoint:', tokenUrl);
    console.log('Token Request Parameters:', {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: '***REDACTED***'
    });
    
    // Exchange code for tokens
    const tokenResponse = await axios.post(tokenUrl, tokenParams.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    const tokens = tokenResponse.data;
    console.log('Token Response:', {
      access_token: tokens.access_token.substring(0, 20) + '...',
      id_token: tokens.id_token ? tokens.id_token.substring(0, 20) + '...' : 'N/A',
      token_type: tokens.token_type,
      expires_in: tokens.expires_in
    });
    
    // Store tokens in session
    req.session.accessToken = tokens.access_token;
    req.session.idToken = tokens.id_token;
    
    // Redirect to home page with success
    res.redirect('/?success=true');
    
  } catch (error) {
    console.error('Token exchange failed:', error.response?.data || error.message);
    res.status(500).send('Token exchange failed');
  }
});

// ============================================
// STEP 4: Get User Information
// ============================================
app.get('/api/userinfo', async (req, res) => {
  console.log('\n=== STEP 4: Fetch User Information ===');
  
  const accessToken = req.session.accessToken;
  
  if (!accessToken) {
    console.log('No access token found in session');
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  try {
    const userinfoUrl = `https://${OKTA_DOMAIN}/oauth2/default/v1/userinfo`;
    
    console.log('UserInfo Endpoint:', userinfoUrl);
    console.log('Using Access Token:', accessToken.substring(0, 20) + '...');
    
    // Fetch user info using access token
    const userInfoResponse = await axios.get(userinfoUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    console.log('User Info Response:', userInfoResponse.data);
    
    res.json({
      userInfo: userInfoResponse.data,
      tokens: {
        access_token: req.session.accessToken,
        id_token: req.session.idToken
      }
    });
    
  } catch (error) {
    console.error('Failed to fetch user info:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
});

// ============================================
// STEP 5: Logout
// ============================================
app.get('/logout', (req, res) => {
  console.log('\n=== STEP 5: Logout ===');
  
  // Clear session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    console.log('Session destroyed successfully');
    
    // Optionally redirect to Okta logout endpoint
    const logoutUrl = `https://${OKTA_DOMAIN}/oauth2/default/v1/logout?` +
      `id_token_hint=${req.session?.idToken || ''}&` +
      `post_logout_redirect_uri=${encodeURIComponent('http://localhost:3000')}`;
    
    res.redirect('/');
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    configured: !!(OKTA_DOMAIN && CLIENT_ID && CLIENT_SECRET),
    okta_domain: OKTA_DOMAIN || 'NOT_CONFIGURED'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 OAuth Demo Server running on http://localhost:${PORT}`);
  console.log(`\n📋 Configuration:`);
  console.log(`   Okta Domain: ${OKTA_DOMAIN || 'NOT_CONFIGURED'}`);
  console.log(`   Client ID: ${CLIENT_ID || 'NOT_CONFIGURED'}`);
  console.log(`   Redirect URI: ${REDIRECT_URI}`);
  console.log(`\n⚠️  Make sure to configure your .env file before testing!\n`);
});
