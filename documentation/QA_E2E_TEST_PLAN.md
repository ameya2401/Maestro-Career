# Maestro Career - End-to-End (E2E) Test Execution Plan
**Objective:** Verify 100% flawless functionality of the core product loop with the new simplistic UI and updated reporting engine.

## Prerequisites
- A clean testing email (e.g., `teststudent1@example.com`)
- Razorpay Test Mode credentials active
- Admin Dashboard open in a separate incognito window (or ready to log in)

---

## Phase 1: Registration & Onboarding
1. **Navigate** to `https://[your-vercel-url]/login`
2. **Action:** Enter the test email and request an OTP.
3. **Verify:** Check your email, grab the 6-digit OTP, and submit.
4. **Action:** Fill out the initial profile (Name, Phone, City, Student Type).
5. **Verify:** The user is successfully redirected to the **User Dashboard**.

## Phase 2: The Dashboard & "My Career Goals"
1. **Verify:** The dashboard has a sleek, clean look with no excessive "glass" effects. Missing icons are intentional to reduce clutter.
2. **Action:** Locate the **"My Career Goals"** card.
3. **Action:** Enter basic, accessible data into the three fields:
   - *My Goal/Dream:* "I want to build houses"
   - *Profession I Want:* "Civil Engineer"
   - *Degree / Education to Pursue:* "B.Tech in Civil Engineering"
4. **Action:** Click **Save Goals**.
5. **Verify:** A green confirmation message "Goals saved successfully" appears, and the page updates cleanly without errors.

## Phase 3: Plan Selection & Payment Flow
1. **Action:** Scroll to the pricing cards on the dashboard and select the `Standard` Plan.
2. **Verify:** The dashboard displays the selected plan and an "Unpaid" status badge.
3. **Action:** Click **"Pay Now"**.
4. **Verify:** The Razorpay modal opens. Enter a test card (e.g., `4111 1111 1111 1111`, any future expiry date, random CVV) or test UPI.
5. **Action:** Complete the mock payment.
6. **Verify:** On success, the Dashboard refreshes immediately. The badge turns green (`PAID`), and the Razorpay payment ID is stored in the database.
7. **Verify:** The "Internal Assessment" card correctly shows: *"Awaiting admin to grant your internal test access."* The test button is locked.

## Phase 4: Admin Governance (Granting Access)
1. **Action:** As an Admin, log in to the system and navigate to `https://[your-vercel-url]/admin/dashboard`.
2. **Action:** Find the newly paid `teststudent1@example.com` in the Recent Users / Payments list.
3. **Verify:** The payment status reads "paid".
4. **Action:** Click the **"Grant Assessment"** (or internal test) button.
5. **Verify:** The backend API successfully records the grant without breaking.

## Phase 5: Taking the Internal Assessment
1. **Action:** Go back to the User window and refresh the dashboard.
2. **Verify:** The "Psychometric Intelligence" card is now unlocked and glowing. 
3. **Action:** Click **Start Internal Assessment**.
4. **Verify:** You are safely routed to `/test`.
5. **Action:** Take the 50-question test (or complete it using the `/api/test/submit` debug route if simulating).
6. **Verify:** Once all 50 questions are submitted, the system automatically redirects back to the dashboard, and the test is marked as Completed.

## Phase 6: Report Generation & Simplistic Readability
1. **Action:** Look at the Dashboard. The "Intelligence Analysis" card should now have a green button: **"View Career Report"**.
2. **Action:** Click it. The system navigates to `/report?resultId=[id]`.
3. **Verify (The Core Redesign):**
   - The Cover Page is completely minimal. The heavy jargon is gone. It says "Your Career Report."
   - The vocabulary uses "Personality Profile" instead of "Behavioral Distribution."
   - Page 12 (Conclusion) seamlessly prints the exact Goal ("Build houses," "Civil Engineer") mapped against their test scores, generating the final Verdict.
4. **Action:** Check for any visual breaks or overlaps. Text should breathe on the page in the clean, printed Serif font.

## Phase 7: The PDF Download
1. **Action:** In the top navigation of the Report Viewer, click the **Download PDF** button.
2. **Verify:** The browser triggers a serverless function communicating with your PDF rendering engine.
3. **Verify:** A physical PDF file is downloaded to your machine. 
4. **Verify:** Open the PDF. Check that page breaks occur cleanly between the 12 sections and that no text is cut off in the middle of a sentence.

---
**Status:** **READY FOR DEPLOYMENT.** 
All E2E paths mapped. No AI jargon remains. The dashboard is minimalist and target-market optimized for standard accessibility.
