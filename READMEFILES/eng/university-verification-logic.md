# University Verification Logic & Flow (SSO Only)

## 1. General Description

**University Verification** is an automated mechanism used to confirm a user's academic status (student) using Single Sign-On (SSO) technology via higher education corporate accounts (Google Workspace for Education or Microsoft Entra ID).
The system authenticates the user through the provider, checks the received email domain against a database of whitelisted educational domains, and automatically assigns the `Verified Student` badge to the profile.

## 2. Core Verification Flow (SSO Flow)

1. **Initiation:** The user navigates to their profile settings (Verification section) and clicks the "Verify with University Account" button (Sign in with Google / Microsoft).
2. **Authentication (OAuth 2.0):** The user is redirected to the provider's login page (Google or Microsoft), where they enter their student credentials (e.g., `student.name@lpnu.ua`).
3. **Data Retrieval:** Upon successful login, the provider returns a token and the user's basic profile (email) to the Huntee backend.
4. **Domain Validation:** The system extracts the domain from the received email (the part after `@`) and checks it against an internal Whitelist of supported universities.
5. **Status Update:** If the domain is valid, the user's status is instantly changed to `Verified`, and the corresponding university badge is attached to their profile.

## 3. Logic Implementation

The platform uses **exclusive OAuth / SSO Integration** (official Google and Microsoft APIs) for verification. Email token verification (magic links) or manual document reviews are **not used**.

- **Advantages of this approach:**
  - Highest level of security (impossible to forge an email, no risk of token leakage).
  - Instant verification without the need to switch tabs or open an inbox.
  - Superior User Experience (UX).
  - Zero load on internal email delivery services.