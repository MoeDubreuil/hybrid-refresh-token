## **Hybrid Refresh Token Reference Implementation**

A teaching‑safe reference implementation of the **Hybrid Refresh Token Model**.

This repository demonstrates the mechanics of the model without exposing any production‑specific identity‑state schema.

The goal is clarity, not completeness.

# **1\. Overview**

Modern authentication systems struggle with two competing goals:

1. **Statelessness**  
2. **Predictable, secure, multi‑device session behavior**

Mainstream refresh‑token models force trade‑offs:

* Opaque database‑stored tokens are stateful and operationally heavy.  
* Long‑lived JWT refresh tokens are stateless but difficult to invalidate safely.

The **Hybrid Refresh Token Model** resolves this tension by anchoring refresh‑token validity to the user’s **identity state**, not to server‑side session records.

This repository implements the hybrid model in a minimal, didactic form.

# **2\. Core Idea**

A refresh token contains:

* a **session‑specific JWT** (unique per device)  
* a **trust hash** derived from the user’s identity state

The server does **not** store refresh tokens.  
The server does **not** store identity hashes.

The server stores only the user record.

On every refresh:

1. Verify the JWT  
2. Load the user  
3. Recompute the identity hash  
4. Compare it to the hash inside the token  
5. Accept only if they match  
6. Rotate the refresh token

If the identity state changes, the identity hash changes, and all refresh tokens become invalid automatically.

# **3\. Identity State (Teaching Version)**

The identity state is the set of user attributes that define whether a session should remain valid.

This teaching repo uses **abstracted** identity‑state fields:

* `id`  
* `login_identifier`  
* `role`  
* `password_fingerprint`  
* `token_version`  
* `app_token_version`

These fields are combined into a deterministic **identity string**, which is then passed through bcrypt to produce an **identity hash**.

The ordering of fields in the identity string is **arbitrary** in this repo.

In production, ordering is a security‑critical invariant and must be stable.

# **4\. Identity Hash**

The identity hash is:

* irreversible  
* stable while identity state is stable  
* changed by any identity‑state change  
* safe to embed in refresh tokens  
* never stored server‑side

This hash is the trust anchor for the refresh token.

# **5\. Refresh Token Structure**

Each refresh token is a JWT containing:

* `purpose: "session_refresh"`  
* `id`  
* `token_hash`  
* `iat` (issued‑at timestamp, added by JWT library)  
* `exp` (expiration timestamp, added by JWT library)

The refresh token is long‑lived (e.g., 7 days).

Each device receives its own refresh token.

# **6\. Access Token Structure**

Access tokens are short‑lived (e.g., 15 minutes) and contain:

* `purpose: "session_access"`  
* `id`  
* `role`

They express what the user is allowed to do.

# **7\. Refresh Flow**

The refresh handler follows this sequence:

1. Read the refresh token cookie  
2. Validate the JWT signature and expiration  
3. Load the user  
4. Recompute the identity hash  
5. Compare it to the hash inside the token  
6. If mismatch → clear cookie, reject  
7. If match → rotate tokens  
8. Align cookie expiration with JWT expiration  
9. Return a new access token

This is the core of the hybrid model.

# **8\. Cookie Lifetime Alignment**

The refresh cookie must expire at the **exact same moment** as the refresh token’s JWT `exp`.

This repository computes:

Code  
maxAgeMs \= (exp \* 1000\) \- now

And sets the cookie’s `maxAge` accordingly.

This prevents:

* premature session termination  
* browsers sending expired tokens  
* noisy logs  
* confusing UX

# **9\. Logout Behavior**

Logout is simple:

* Clear the refresh cookie  
* Do not store or revoke tokens  
* Do not track devices

Each device logs itself out independently.

# **10\. Global Logout**

Incrementing `token_version` invalidates all refresh tokens for a user.

Incrementing `app_token_version` invalidates all refresh tokens for all users.

No token store is required.

# **11\. Multi‑Device Behavior**

The hybrid model naturally supports:

* independent device sessions  
* independent rotation  
* no cross‑device interference  
* predictable global invalidation

Each device maintains its own refresh token and rotates independently.

# **12\. Teaching Notes**

This repository intentionally:

* uses abstract identity‑state fields  
* uses arbitrary identity‑string ordering  
* omits password verification logic  
* omits session tables  
* omits email flows  
* omits admin endpoints

The goal is to demonstrate the **mechanics** of the hybrid model without exposing production‑specific details.

# **13\. Running the Example**

This repository uses dotenv. Environment variables are loaded from \`.env\` by  
\`**src/**index.js\` before any other modules are imported. This ensures that token  
secrets, trust epochs, and port configuration are available at startup.

Seed users manually via `userModel.seedUser()`.

## **Installing Dependencies (Windows Convenience Script)**

This repository includes a Windows‑based batch file located at:

Code

**scripts/**install\_depends.bat

This script installs the Node dependencies required by the teaching project:

* express  
* cookie-parser  
* dotenv  
* bcrypt  
* jsonwebtoken

Running the script will:

* create the `node_modules` directory at the repo root  
* generate a `package.json` file (if one does not already exist)  
* generate a `package-lock.json` file  
* install the dependencies listed above

The script is provided purely as a convenience.

It is not required to understand the hybrid refresh‑token model.

To use it:

Code

cd scripts

Install\_depends.bat

## **Running the server (from repo root)**

Code  
copy .env.example .env  
node **src/**index.js

## **Quick Test (Using curl)**

This repository includes a seeded example user so the hybrid refresh‑token flow can be exercised immediately after starting the server.

Code

login\_identifier: demo@example.com

password:         (not checked in this teaching repo)

After installing dependencies and starting the server:

Code

node src/index.js

You can test the hybrid model using curl.

### **1\. Login**

This issues:

* a short‑lived **access token** in the JSON response  
* a long‑lived **refresh token** stored in an HTTP‑only cookie

Code

`curl -i -X POST http://localhost:3000/auth/login ^`

   `-H "Content-Type: application/json" ^`

   `-d "{\"login_identifier\":\"demo@example.com\",\"password\":\"demo\"}"`

Look for:

* `Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Strict`  
* `accessToken` in the JSON body

### **2\. Refresh**

This demonstrates:

* **identity‑hash validation**  
* **refresh‑token rotation**  
* **cookie expiration alignment**

Replace `YOUR_REFRESH_TOKEN_HERE` with the cookie value returned from login.

Code

`curl -i -X POST http://localhost:3000/auth/refresh ^`

   `--cookie "refreshToken=YOUR_REFRESH_TOKEN_HERE"`

Look for:

* a **new** refresh token in `Set-Cookie`  
* a **new** access token in the JSON body

This confirms rotation is working.

### **3\. Logout**

This clears the refresh cookie and ends the session.

Code

`curl -i -X POST http://localhost:3000/auth/logout ^`

   `--cookie "refreshToken=YOUR_REFRESH_TOKEN_HERE"`

Look for:

* `Set-Cookie: refreshToken=; Max-Age=0`

This demonstrates **stateless logout**.

### **4\. What This Quick Test Demonstrates**

* **Identity‑hash validation**  
* **Refresh‑token rotation**  
* **Cookie expiration alignment**  
* **Stateless logout**

This is the smallest, clearest demonstration of the hybrid refresh‑token model end‑to‑end.

## **Optional Convenience Scripts (Windows)**

The `scripts/` directory includes simple Windows batch files that wrap the curl commands used in the Quick Test:

Code

scripts/login.bat

scripts/refresh.bat

scripts/logout.bat

These scripts do not add new behavior.

They run the same requests shown above and are provided as a convenience for Windows users.

# **14\. File Structure**

**src/**  
   **auth/**  
      accessTokens.js  
      refreshTokens.js  
      loginHandler.js  
      handleRefresh.js  
      logoutHandler.js

   **identity/**  
      identityState.js  
      identityString.js  
      identityHash.js

   **utils/**  
      crypto.js  
      cookies.js

   **models/**  
      userModel.js

   **http/**  
      server.js  
      routes.js

   index.js

# **15\. License**

This reference implementation is provided for educational purposes.

