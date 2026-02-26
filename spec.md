# Specification

## Summary
**Goal:** Replace the existing login flow with phone number-only authentication and add an admin-accessible "Add Product" navigation option.

**Planned changes:**
- Replace the current login UI (AuthGuard and LoginButton) with a single phone number input field; no email, password, or Internet Identity prompt
- Store and use the phone number as the user identifier for session creation/retrieval in the backend
- Show an error message for empty or invalid phone number submissions
- Add an "Add Product" link in the header navigation (desktop and mobile) visible only to admin users
- Clicking "Add Product" navigates to the product creation form (name, description, price, stock, image)
- Successfully submitting the product creation form creates a new product and shows a confirmation

**User-visible outcome:** Users log in using only their phone number, and admin users can access a product creation form directly from the navigation header.
