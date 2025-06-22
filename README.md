# 🚗 Vroomi – Campus Ride-Sharing Platform

Vroomi is a student-first ride-sharing web app designed to make commuting smarter, safer, and more sustainable. Whether you're heading to a 9 a.m. lecture or returning from a late-night study session, Vroomi matches you with trusted peers for shared rides—saving time, money, and carbon emissions.

---

## ✨ Features

- 🔐 **Student-Only Access** – Verify with a university email using Clerk authentication.
- 📍 **Smart Route Matching** – Custom-built TSP-based algorithm to optimize multi-passenger pickups.
- 🧭 **Real-Time Map Visualization** – Dynamic Leaflet.js integration with OpenStreetMap.
- 💰 **Fair Cost Splitting** – Automatically calculate ride costs based on distance and split evenly using Stripe backend integration.
- 🧑‍✈️ **Driver Dashboard** – Manage rides, view stats, and interact with riders.
- 🔁 **Ride Animations & Visual Feedback** – Built-in UI animations for a smoother experience.

---

## 🛠️ Tech Stack

| Layer         | Technologies Used                                                                 |
|---------------|-------------------------------------------------------------------------------------|
| Frontend      | React, Tailwind CSS, TypeScript, Leaflet.js, OpenStreetMap                         |
| Backend       | Supabase (Database & Auth), Stripe (Payments), Clerk (User Verification)           |
| Deployment    | Vercel (Hosting), GoDaddy (Custom Domain)                                          |

---

## 🧠 How It Works

1. **User logs in** with their verified university email.
2. **Inputs home address** and **departure time**.
3. The app:
   - Geocodes the location via OpenStreetMap.
   - Matches the user with nearby riders.
   - Optimizes pickup route using a pathfinding algorithm.
   - Calculates and splits ride cost automatically.
4. **Drivers** access a personalized dashboard with ride stats and upcoming trips.
5. **Students communicate** safely via integrated contact options.

---

## 🚀 Getting Started (Local Setup)

1. **Clone the repository**  
   ```bash
   git clone https://github.com/yourusername/vroomi.git
   cd vroomi
