**This repository is a teaching reference.
It is not a production authentication system.
It intentionally omits security‑critical features**.

# **Hybrid Refresh Token Reference Implementation**

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

The **Hybrid Refresh Token Model** resolves this tension by anchoring refresh‑token validity to the user’s **identity state**, not to server‑side token storage.

This repository implements the hybrid model in minimal form.

# **2\. Core Idea**

A refresh token contains:

* a **session‑specific JWT** (unique per device)  
* a **trust hash** derived from the user’s identity state

The server does **not** store refresh tokens.

The server does **not** store identity hashes.

The server stores only the user record and a minimal **non-tracking session table**.

On every refresh:

1. Validate the JWT  
2. Load the user  
3. Recompute the identity hash  
4. Compare it to the hash inside the token  
5. Validate the session fingerprint  
6. Accept only if both match  
7. Rotate the refresh token

If the identity state changes, the identity hash changes, and all refresh tokens become invalid automatically.

If the session fingerprint changes, only that session becomes invalid.

# **3\. Identity State (Teaching Version)**

The identity state is the set of user attributes that define whether a session should remain valid.

This teaching repo uses **abstracted** identity‑state fields:

* `id`  
* `login_identifier`  
* `role`  
* `password_fingerprint`  
* `token_version`  
* `app_token_version`

These fields are combined into a deterministic **identity string**, which is then passed through the bcrypt algorithm to produce an **identity hash**.

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
* `user_id`  
* `token_hash`  
* `session_id`  
* `refresh_counter`  
* `iat` / `exp`

The refresh token is long‑lived (e.g., 7 days).

Each device receives its own refresh token.

# **6\. Access Token Structure**

Access tokens are short‑lived (e.g., 15 minutes) and contain:

* `purpose: "session_access"`  
* `id`  
* `role`

They express what the user is allowed to do.

# **7\. Session Table (Teaching Version)**

This repository includes a minimal **non‑tracking session table** implemented with a JavaScript `Map`.

Each session record contains:

* `session_id`  
* `user_id`  
* `refresh_counter`  
* timestamps

The table does **not** track devices.

It does **not** store refresh tokens.

It does **not** store identity hashes.

It exists only to support:

* refresh‑counter rotation  
* session‑fingerprint validation  
* session deletion  
* global invalidation

# **8\. Refresh Flow**

The refresh handler follows this sequence:

1. Read the refresh token cookie  
2. Validate the JWT  
3. Load the user  
4. Recompute the identity hash  
5. Compare it to the hash inside the token  
6. Load the session  
7. Validate the session fingerprint  
8. Rotate tokens  
9. Align cookie expiration with JWT expiration  
10. Return a new access token

This is the core of the hybrid model.

# **9\. Cookie Lifetime Alignment**

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

# **10\. Logout Behavior**

Logout is simple:

* Clear the refresh cookie
* Delete the associated session row (if the refresh token is valid)
* Do not store or revoke tokens
* Do not track devices

Each device logs itself out independently.

# **11\. Global Logout**

Incrementing `token_version` invalidates all refresh tokens for a user, deletes all associated session rows, and clears the current user's cookie.

Incrementing `app_token_version` invalidates all refresh tokens for all users.

No token store is required.

# **12\. Multi‑Device Behavior**

The hybrid model naturally supports:

* independent device sessions  
* independent rotation  
* no cross‑device interference  
* predictable global invalidation

Each device maintains its own refresh token and rotates independently.

# **13\. Demonstration Scripts**

The `scripts/` directory includes Windows batch files that demonstrate:

* **identity‑hash mismatch** (global invalidation)  
* **session‑fingerprint mismatch** (per‑session theft detection)  
* **refresh rotation**  
* **stateless logout**
* **session deletion on logout**
* **session deletion on logout‑all**

These scripts use intentionally verbose error messages for teaching purposes.

Production systems should collapse all refresh failures to a generic `401 Unauthorized`.

# **14\. Running the Example**

This repository uses dotenv. Environment variables are loaded from `.env` by `src/index.js` before any other modules are imported.

Seed users manually via `userModel.seedUser()`.

### **Install dependencies (Windows)**

Code

cd scripts

install\_depends.bat

### **Start the server**

Code

copy .env.example .env

node src/index.js

### **Quick Test (curl)**

A seeded demo user is included:

Code

login\_identifier: demo@example.com

password:         (not checked in this teaching repo)

#### **1\. Login**

Issues:

* access token (JSON)  
* refresh token (cookie)

#### **2\. Refresh**

Demonstrates:

* identity‑hash validation  
* session‑fingerprint validation  
* refresh‑token rotation  
* cookie expiration alignment

#### **3\. Logout**

Clears the refresh cookie.

# **15\. File Structure**

Code

src/

   auth/

      accessTokens.js

      refreshTokens.js

      loginHandler.js

      handleRefresh.js

      logoutHandler.js

   identity/

      identityState.js

      identityString.js

      identityHash.js

   utils/

      crypto.js

      cookies.js

   models/

      userModel.js

      sessionsModel.js

   http/

      server.js

      routes.js

   index.js

# **16\. License**

This reference implementation is provided for educational purposes.

