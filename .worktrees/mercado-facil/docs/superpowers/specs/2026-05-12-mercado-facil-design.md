# Mercado Facil ACKER - Design Document

## Goal
A real-time shared grocery list application that allows users to add items, check them off, and share the list with friends, where updates are synchronized instantly across all devices. Additionally, it features a bill-splitting calculator.

## Architecture & Tech Stack
- **Frontend Framework:** React 18 bootstrapped with Vite for fast build and development.
- **Styling:** Tailwind CSS for responsive, mobile-first design, combined with `lucide-react` for iconography.
- **Backend/Database:** Firebase Firestore (Spark Free Plan) for real-time NoSQL data synchronization.
- **Authentication:** Firebase Anonymous Authentication for frictionless onboarding (no passwords needed).
- **Hosting:** GitHub Pages or Firebase Hosting for free deployment.

## Components & Data Flow
1. **List Management:**
   - Users can paste text (e.g., from WhatsApp). The text is parsed, split by lines, and added as independent items.
   - Items have `id`, `text`, `checked`, and `timestamp`.
   - Any state change (add, toggle, remove) instantly syncs to a specific Firestore Document representing that shared list.
2. **Real-time Sync:**
   - `onSnapshot` listener attaches to the active list document.
   - When "Friend 1" checks an item, Firestore pushes the update, triggering a React state update for "Friend 2".
3. **Multi-List Support (Sharing):**
   - The app will support URL-based lists (e.g., `?list=ab12cd`).
   - If no list ID is in the URL, a new random one is generated and the URL is updated. Sharing the URL shares the list.
4. **Bill Splitting:**
   - A calculator section that takes the total amount and an array of `buyers` (families/friends) with the number of "heads" per buyer.
   - Calculates the cost per head and total per buyer, also synced via Firestore.

## Error Handling & Edge Cases
- **Offline State:** Firestore handles offline persistence gracefully; actions are queued and synced when the connection returns.
- **Missing Firebase Config:** The app will display a friendly "Setup Needed" screen if Firebase environment variables are missing, guiding the user to add them.
