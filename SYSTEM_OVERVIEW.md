# Project Architecture & System Flow Overview

This document provides a descriptive explanation of the core modules in the project, intended for stakeholders and clients.

---

## 1. Authentication & User Management (Supabase Auth)
The foundation of the user system is built on **Supabase Auth**, which provides a secure and scalable way to manage user identities.

### Registration Flow:
- **Initial Step**: A new user provides their full name, email, mobile number, and password. 
- **Verification**: To ensure the email belongs to the user, an OTP (One-Time Password) or a verification link is sent to their inbox.
- **Completion**: Once verified, a unique account is created in the system.

### Login Flow:
- Users have two ways to access their account:
    1. **Password Login**: Standard email and password combination.
    2. **OTP Login**: A more modern, password-less approach where a temporary code is sent to their email for one-time access. This is highly secure as it doesn't require the user to remember passwords.

---

## 2. Profile & Data Storage (Supabase Database)
While Supabase Auth handles the "identity," the **Supabase PostgreSQL Database** handles the "person."

### Linking User Data:
- Every user is assigned a unique ID upon registration. This ID is used to link their account to a **Profile Table**.
- This table stores descriptive details like:
    - Educational background (Student vs. Working Professional).
    - Current city and domain of interest.
    - Preferred career services.
    - Historical activity (when they last logged in, how many times they've visited, etc.).

---

## 3. Email Integration (Brevo / "Bravo")
To maintain professional communication and high deliverability, the system integrates with **Brevo** as the primary email gateway.

### How it works:
- Instead of the app sending emails directly (which often end up in spam), it uses Brevo's specialized **SMTP infrastructure**.
- **Supabase** acts as the brain that decides *when* an email is needed (e.g., "User forgot password" or "New registration").
- **Brevo** acts as the courier that actually *delivers* the message to the user's inbox securely.
- This ensures that critical messages like password resets and welcome emails are delivered instantly and reliably.

---

## 4. Payment Gateway Integration (Razorpay)
The project uses **Razorpay**, India's leading payment gateway, to handle financial transactions for career plans.

### The Payment Flow:
1. **Initiation**: When a user clicks "Pay Now," the system communicates with Razorpay to create a "Secure Order."
2. **Payment Modal**: A secure, encrypted window opens (provided by Razorpay) where the user can pay via UPI, Credit/Debit Cards, or Netbanking.
3. **Verification (The "Security Handshake")**: After the user pays, Razorpay sends back a digital "signature." The system then performs a server-side verification to ensure the payment is genuine and hasn't been tampered with.
4. **Success**: Once verified, the user is redirected to a success page, and their payment details are recorded.

---

## 5. Summary: How it all connects (The Big Picture)

1. **User Journey**: A visitor discovers a plan, decides to sign up (Supabase Auth), and receives a welcome email (Brevo).
2. **Onboarding**: They fill in their professional details, which are stored securely in their profile (Supabase DB).
3. **Transaction**: They choose a career mentorship plan and pay via a secure gateway (Razorpay).
4. **Outcome**: The system verifies the payment, updates the user's status, and they gain access to their purchased services.

This architecture ensures that data is synchronized across all platforms (Auth, Database, Emails, and Payments) using the user's unique ID as the common thread.
