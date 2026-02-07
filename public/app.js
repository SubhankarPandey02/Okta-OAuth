// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const resetBtn = document.getElementById('resetBtn');
const clearLogsBtn = document.getElementById('clearLogsBtn');
const logsContainer = document.getElementById('logs');
const userInfoSection = document.getElementById('userInfoSection');
const userInfoContent = document.getElementById('userInfoContent');
const tokenSection = document.getElementById('tokenSection');
const accessTokenEl = document.getElementById('accessToken');
const idTokenEl = document.getElementById('idToken');

// State
let currentStep = 0;

// Utility Functions
function addLog(message, type = 'info') {
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;

    const time = new Date().toLocaleTimeString();
    logEntry.innerHTML = `
        <span class="log-time">${time}</span>
        <span class="log-message">${message}</span>
    `;

    logsContainer.appendChild(logEntry);
    logsContainer.scrollTop = logsContainer.scrollHeight;
}

function updateStepStatus(stepNumber, status) {
    const step = document.getElementById(`step${stepNumber}`);
    const statusEl = step.querySelector('.step-status');

    // Remove all status classes
    step.classList.remove('active', 'completed');
    statusEl.classList.remove('pending', 'active', 'completed');

    // Add new status
    if (status === 'active') {
        step.classList.add('active');
        statusEl.classList.add('active');
        statusEl.textContent = 'In Progress';
    } else if (status === 'completed') {
        step.classList.add('completed');
        statusEl.classList.add('completed');
        statusEl.textContent = 'Completed';
    } else {
        statusEl.classList.add('pending');
        statusEl.textContent = 'Pending';
    }
}

function resetDemo() {
    // Reset all steps
    for (let i = 1; i <= 5; i++) {
        updateStepStatus(i, 'pending');
    }

    // Hide user info and tokens
    userInfoSection.classList.add('hidden');
    tokenSection.classList.add('hidden');

    // Enable/disable buttons
    loginBtn.disabled = false;
    logoutBtn.disabled = true;

    // Clear logs
    logsContainer.innerHTML = '';
    addLog('Demo reset. Click "Start OAuth Flow" to begin.', 'info');

    currentStep = 0;
}

function displayUserInfo(data) {
    const { userInfo, tokens } = data;

    // Display user information
    userInfoContent.innerHTML = `
        <div class="user-detail"><strong>Name:</strong> <span>${userInfo.name || 'N/A'}</span></div>
        <div class="user-detail"><strong>Email:</strong> <span>${userInfo.email || 'N/A'}</span></div>
        <div class="user-detail"><strong>Subject:</strong> <span>${userInfo.sub || 'N/A'}</span></div>
        <div class="user-detail"><strong>Email Verified:</strong> <span>${userInfo.email_verified ? 'Yes' : 'No'}</span></div>
    `;
    userInfoSection.classList.remove('hidden');

    // Display tokens
    accessTokenEl.textContent = tokens.access_token;
    idTokenEl.textContent = tokens.id_token || 'N/A';
    tokenSection.classList.remove('hidden');

    addLog('✅ User information retrieved successfully!', 'success');
    addLog(`User: ${userInfo.name} (${userInfo.email})`, 'success');
}

// Event Handlers
loginBtn.addEventListener('click', () => {
    addLog('🚀 Initiating OAuth 2.0 Authorization Code Flow...', 'info');
    addLog('Step 1: Redirecting to Okta authorization endpoint', 'info');
    updateStepStatus(1, 'active');

    // Redirect to login endpoint
    window.location.href = '/login';
});

logoutBtn.addEventListener('click', () => {
    addLog('🚪 Logging out...', 'info');

    // Clear UI
    userInfoSection.classList.add('hidden');
    tokenSection.classList.add('hidden');

    // Redirect to logout
    window.location.href = '/logout';
});

resetBtn.addEventListener('click', resetDemo);

clearLogsBtn.addEventListener('click', () => {
    logsContainer.innerHTML = '';
    addLog('Logs cleared', 'info');
});

// Check if we just completed OAuth flow
async function checkAuthStatus() {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('success') === 'true') {
        // OAuth flow completed successfully
        addLog('✅ Authorization code received and validated!', 'success');
        updateStepStatus(1, 'completed');
        updateStepStatus(2, 'completed');
        updateStepStatus(3, 'completed');

        addLog('Step 4: Exchanging authorization code for tokens...', 'info');
        updateStepStatus(4, 'active');

        // Small delay for visual effect
        setTimeout(async () => {
            updateStepStatus(4, 'completed');
            addLog('✅ Tokens received successfully!', 'success');

            addLog('Step 5: Fetching user information with access token...', 'info');
            updateStepStatus(5, 'active');

            try {
                const response = await fetch('/api/userinfo');
                const data = await response.json();

                updateStepStatus(5, 'completed');
                displayUserInfo(data);

                // Update buttons
                loginBtn.disabled = true;
                logoutBtn.disabled = false;

                addLog('🎉 OAuth flow completed successfully!', 'success');

            } catch (error) {
                addLog('❌ Failed to fetch user information: ' + error.message, 'error');
                updateStepStatus(5, 'pending');
            }
        }, 1000);

        // Clean up URL
        window.history.replaceState({}, document.title, '/');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    addLog('OAuth 2.0 Authorization Code Flow Demo initialized', 'info');
    addLog('Click "Start OAuth Flow" to begin the demonstration', 'info');

    // Check if we're returning from OAuth
    checkAuthStatus();
});

// Health check on load
fetch('/api/health')
    .then(res => res.json())
    .then(data => {
        if (!data.configured) {
            addLog('⚠️ Warning: Okta credentials not configured. Please set up your .env file.', 'warning');
        } else {
            addLog(`✅ Connected to Okta domain: ${data.okta_domain}`, 'success');
        }
    })
    .catch(err => {
        addLog('❌ Failed to connect to server: ' + err.message, 'error');
    });
