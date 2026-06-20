 Security & Credential Awareness

1)What should never be committed to Git repositories?

 Sensitive data: This includes API keys, passwords, database credentials, encryption keys, and personally identifiable information (PII)
Environment files:Files like .env containing local configurations.
Build artifacts & dependencies: Folders like node_modules,dist/, or .exe files 

 2) How should environment variables be managed?

Store locally in hidden files: Keep them in a .env file at the root of the project.
Use .gitignore: Always add the .env file to your .gitignore to prevent it from being tracked.
Use platform settings in production:Inject them securely through the hosting provider's dashboard rather than hardcoding them into the application code.

3)  What would you do if credentials were accidentally pushed to GitHub?
  
Revoke immediately: Consider the leaked credentials compromised and instantly rotate, delete, or deactivate them.

 Purge Git history: Use tools like git-filter-repo or BFG Repo-Cleaner to completely remove the sensitive files from the repository's history, not just the latest commit.
 
Check logs: Review access logs for that specific credential to ensure it wasn't abused during the exposure window.

4) What is XSS?

Cross-Site Scripting (XSS) is a security vulnerability where an attacker injects malicious scripts (usually JavaScript) into a trusted website. When a victim's browser loads the page, the malicious script executes, potentially stealing session tokens, cookies, or sensitive user data

5)Difference between Authentication and Authorization

Authentication: is the process of verifying **who you are** (identity verification).

Authorization:is the process of verifying **what you can access** (permission verification).

Analogy:
- Authentication = Showing your ID to enter a building
- Authorization = Having the right key card to access specific floors

6)Why is HTTPS important?

Encryption: It encrypts the data transferred between the user's browser and the server, preventing eavesdropping.
Data Integrity:It ensures that the data cannot be modified or corrupted during transit without detection.
Authentication: It proves to the user that they are communicating with the actual intended website, building trust and boosting SEO rankings.


7) What is rate limiting?

Rate limiting is a network traffic management technique that limits the number of requests a user or an IP address can make to a server within a specific timeframe. It protects applications against brute-force attacks, DDoS attacks, and API resource abuse.
