# **Hybrid Refresh Token Demo Scripts**

This directory contains a set of **operator‑friendly batch scripts** that demonstrate the behavior of the *Hybrid Refresh Token System* implemented in this teaching repository.

Each script exercises a specific part of the model:

* refresh rotation  
* identity hash (global invalidation)  
* session fingerprint (per‑session theft detection)  
* cookie handling  
* session table behavior

These scripts are intentionally simple, reproducible, and designed for step‑by‑step observation.

## **Core Scripts**

### **login.bat**

Logs in as the demo user and writes the issued refresh cookie to:

cookies/demo.txt

This establishes:

* a valid session  
* refresh\_counter \= 0  
* a valid identity hash  
* a valid session fingerprint

### **refresh.bat**

Performs a normal refresh using the cookie in:

cookies/demo.txt

This demonstrates:

* refresh token validation  
* session lookup  
* identity hash validation  
* session fingerprint validation  
* refresh\_counter rotation (0 → 1 → 2 → …)

### **logout.bat**

Invalidates the current session and clears the refresh cookie.

This demonstrates:

* session deletion  
* cookie clearing  
* client‑side invalidation

## **Demonstration Scripts**

These scripts illustrate the **two distinct invalidation mechanisms** in the hybrid model.

### **⭐ identity-mismatch-demo.bat**

**Demonstrates global invalidation via identity hash mismatch.**

Sequence:

1. Login → obtain refresh cookie  
2. Refresh → rotates refresh\_counter  
3. Logout‑all → bumps `token_version` and deletes all sessions  
4. Refresh again → server detects identity hash mismatch

Server log:

REFRESH FAILED: identity hash mismatch detected

Client output (teaching‑repo verbose mode):

{"error":"Identity hash mismatch (global invalidation triggered)."}

This shows how changing user‑level identity fields (or calling logout‑all) invalidates *all* refresh tokens.

### **⭐ theft-detection-demo.bat**

**Demonstrates per‑session theft detection via session fingerprint mismatch.**

Sequence:

1. Login → obtain refresh cookie  
2. Save original cookie (attacker token)  
3. Refresh → rotates refresh\_counter (0 → 1\)  
4. Replay original cookie → fingerprint mismatch detected

Server log:

REFRESH FAILED: session fingerprint mismatch detected

Client output (teaching‑repo verbose mode):

{"error":"Session fingerprint mismatch (possible token theft)."}

This shows how replaying an old refresh token triggers theft detection even when:

* identity hash matches  
* session exists  
* JWT is structurally valid

## **Cookie Directory**

All scripts write cookies to:

Code  
scripts/cookies/

This directory is ignored by Git to keep the repo clean and prevent accidental commits of demo tokens.

## **Notes for Implementers**

The verbose error messages in these demos are **for teaching only**.

* Production systems should collapse all refresh failures to a generic `401 Unauthorized`.  
* The hybrid model relies on **two independent invalidation mechanisms**:  
  * **Identity hash mismatch** → global invalidation  
  * **Session fingerprint mismatch** → per‑session theft detection

These scripts are intentionally minimal and operator‑friendly.

* They are not intended to be used in production environments.

