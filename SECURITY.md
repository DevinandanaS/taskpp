# Security & Credential Awareness

## 1. What should never be committed to Git repositories?

The following items should **never** be committed to Git repositories:

- **API keys and secrets** (AWS keys, database credentials, third-party API keys)
- **Passwords** (hardcoded passwords, default credentials)
- **Private keys** (SSH keys, SSL certificates, encryption keys)
- **Environment files** (.env files containing sensitive data)
- **Database credentials** (connection strings, database passwords)
- **Authentication tokens** (JWT secrets, OAuth tokens, session secrets)
- **Personal Identifiable Information (PII)** (user data, email addresses)
- **Configuration files with sensitive data** (config files with production credentials)

## 2. How should environment variables be managed?

Environment variables should be managed using:

- **`.env` files** for local development (always add to .gitignore)
- **`.env.example` files** to document required variables without actual values
- **Environment-specific files** (.env.development, .env.production)
- **Secret management services** in production (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault)
- **CI/CD environment variables** for deployment pipelines
- **Container orchestration secrets** (Kubernetes Secrets, Docker Secrets)

**Best Practices:**
- Never commit .env files
- Use different credentials for development and production
- Rotate secrets regularly
- Limit access to production environment variables

## 3. What would you do if credentials were accidentally pushed to GitHub?

If credentials are accidentally pushed to GitHub:

1. **Immediately revoke/rotate the exposed credentials** - Change passwords, regenerate API keys
2. **Remove the sensitive data from Git history** using:
   - `git filter-branch` or `BFG Repo-Cleaner`
   - Force push the cleaned repository
3. **Notify relevant stakeholders** about the security incident
4. **Audit for unauthorized access** - Check logs for any suspicious activity
5. **Update secrets in all environments** where they were used
6. **Add proper .gitignore rules** to prevent future incidents
7. **Consider the repository compromised** - Assume the credentials were accessed

**Note:** Simply deleting the file in a new commit doesn't remove it from Git history!

## 4. What is XSS?

**XSS (Cross-Site Scripting)** is a security vulnerability where attackers inject malicious scripts into web pages viewed by other users.

**Types:**
- **Stored XSS:** Malicious script is stored on the server (e.g., in a database)
- **Reflected XSS:** Script is reflected off a web server (e.g., in URL parameters)
- **DOM-based XSS:** Vulnerability exists in client-side code

**Example:**
```javascript
// Vulnerable code
element.innerHTML = userInput; // User input: <script>alert('XSS')</script>
```

**Prevention:**
- Sanitize and validate all user input
- Use `textContent` instead of `innerHTML`
- Implement Content Security Policy (CSP)
- Encode output data
- Use frameworks with built-in XSS protection (React automatically escapes)

## 5. Difference between Authentication and Authorization

**Authentication** is the process of verifying **who you are** (identity verification).
- Examples: Login with username/password, biometric verification, two-factor authentication
- Answers: "Are you who you claim to be?"

**Authorization** is the process of verifying **what you can access** (permission verification).
- Examples: Role-based access control, permissions, access levels
- Answers: "What are you allowed to do?"

**Analogy:**
- Authentication = Showing your ID to enter a building
- Authorization = Having the right key card to access specific floors

## 6. Why is HTTPS important?

**HTTPS (HTTP Secure)** is important because:

1. **Encryption:** Data transmitted between client and server is encrypted, preventing eavesdropping
2. **Data Integrity:** Ensures data hasn't been tampered with during transmission
3. **Authentication:** Verifies the website's identity through SSL/TLS certificates
4. **Trust:** Browsers show security indicators, building user confidence
5. **SEO Benefits:** Search engines prioritize HTTPS sites
6. **Compliance:** Many regulations (PCI DSS, GDPR) require HTTPS
7. **Modern Features:** Many browser APIs (geolocation, camera) require HTTPS

**Without HTTPS:**
- Passwords can be intercepted
- Man-in-the-middle attacks are possible
- User data is exposed
- Session hijacking is easier

## 7. What is rate limiting?

**Rate limiting** is a technique to control the number of requests a user can make to an API or service within a specific time period.

**Purpose:**
- **Prevent abuse:** Stop brute-force attacks, DDoS attempts
- **Ensure fair usage:** Distribute resources equally among users
- **Protect infrastructure:** Prevent server overload
- **Control costs:** Limit API usage for free tiers

**Common Implementations:**
- **Fixed window:** 100 requests per hour
- **Sliding window:** 100 requests in any 60-minute period
- **Token bucket:** Requests consume tokens that refill over time
- **Leaky bucket:** Requests processed at a constant rate

**Example Response:**
```
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1640000000
```

**Implementation:**
- Server-side middleware
- API gateways
- Reverse proxies (nginx, HAProxy)
- CDN services (Cloudflare)
