# DineSync

DineSync is a collaborative dining decision app that solves the age-old problem of groups struggling to decide where to eat. Friends join a shared session, swipe YES or NO on nearby restaurants, and DineSync picks the winner based on everyone's votes.

---

## Features

- **Swipe to vote** — Card-based interface where everyone votes on the same set of restaurants
- **Group sessions** — Host creates a session, shares a code, friends join and swipe together
- **Smart matching** — Top 3 restaurants ranked by combined group votes, filtered to positive scores only
- **Friends system** — Send/accept friend requests, view profiles, manage your friends list
- **Saved groups** — Create named groups so you can quickly session with your usual crew
- **Favorites** — Save restaurants you love; prompted after each session's winner is revealed
- **Recents** — Automatically tracks winning restaurants from past sessions
- **Dietary filters** — Dietary preferences applied when searching for restaurants
- **Location-aware** — Uses your device location to find restaurants within a set distance and budget

---

## Tech Stack

### Frontend
- **React Native** 0.81.5 with **Expo** 54.0.33
- **React Navigation** — native stack navigation
- **react-native-deck-swiper** — card swiping interface
- **expo-linear-gradient** — gradient UI
- **expo-location** — device geolocation
- **@react-native-async-storage** — local token and session storage

### Backend
- **Python / Flask** 3.0.0
- **Flask-SQLAlchemy** — ORM
- **Flask-JWT-Extended** — JWT authentication
- **Flask-CORS** — cross-origin support
- **psycopg2** — PostgreSQL driver
- **bcrypt** — password hashing

### Database
- **PostgreSQL** (via Docker)

### External APIs
- **Geoapify Places API** — restaurant discovery

---

## Project Structure

```
ctrl-alt-elite/
├── src/
│   ├── screens/         # All app screens
│   ├── components/      # Shared components (UserContext, SwipeCard, etc.)
│   └── services/
│       └── api.js       # All backend API calls
├── assets/
│   └── images/          # App icons and images
├── backend/
│   ├── app/
│   │   ├── models/      # SQLAlchemy database models
│   │   ├── routes/      # Flask API blueprints
│   │   ├── utils/       # Helper functions (helpers.py)
│   │   └── __init__.py  # App factory
│   ├── run.py           # Backend entry point
│   └── .env             # Environment variables (not committed)
├── App.js               # Root navigation and screen registration
└── docker-compose.yml   # PostgreSQL container setup
```

---

## Getting Started

### Prerequisites
- Node.js & npm
- Python 3.12+
- Docker (for PostgreSQL)
- Expo Go app on your phone (or an iOS/Android simulator)
- A [Geoapify](https://www.geoapify.com/) API key (free tier works)

---

### 1. Start the Database

```bash
docker-compose up -d
```

This starts a PostgreSQL container. The database (`dinnerdecider`) and user (`appuser`) are created automatically. Tables are created on first backend startup.

---

### 2. Configure the Backend

Create a `.env` file inside the `backend/` directory:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dinnerdecider
DB_USER=appuser
DB_PASS=apppass
JWT_SECRET=your-secret-key
GEOAPIFY_API_KEY=your-geoapify-api-key
```

---

### 3. Start the Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

The server runs on `http://localhost:5001`. All database tables are created automatically on startup.

---

### 4. Start the Frontend

From the project root:

```bash
npm install
npm start
```

Scan the QR code with Expo Go on your phone, or press `i` for iOS simulator / `a` for Android emulator.

---

## API Overview

| Prefix | Key Endpoints |
|---|---|
| `/auth` | `POST /register`, `POST /login` |
| `/sessions` | Create, join, start, finalize sessions |
| `/votes` | Cast votes, tally scores, finalize winner |
| `/restaurants` | Search nearby via Geoapify |
| `/users` | Profile, search, favorites management |
| `/friends` | Send/accept/decline requests, list friends |
| `/groups` | Create, list, delete saved groups |

---

## How a Session Works

1. **Host** opens the app → taps **Start Swiping** → sets budget and distance → creates a session
2. Host shares the **session code** with friends
3. **Friends** tap **Join Session** → enter the code → enter the lobby
4. Host taps **Start Swiping** → everyone gets the same 10 restaurants to swipe on
5. Swipe **right (YES)** or **left (NO)** on each restaurant
6. Once everyone finishes, the host taps **See Results**
7. The **top 3 restaurants** with positive votes are shown, ranked by score
8. Next time the host opens the app, they're prompted to **add the winner to their favorites**

---

## Screens

| Screen | Description |
|---|---|
| LoginScreen | Email/password login |
| NamesScreen | First and last name during registration |
| EmailPassword | Email and password during registration |
| DietaryRestrictionsScreen | Dietary preferences during registration |
| HomeScreen | Main hub — start or join sessions |
| SessionScreen | Create a session (budget + distance) |
| JoinSessionScreen | Join a session with a code |
| SessionLobbyScreen | Pre-game lobby with participant list |
| SwipeCardScreen | Swipe YES/NO on restaurants |
| WaitingScreen | Wait for all votes to be submitted |
| MatchScreen | Show top 3 results ranked by group votes |
| UserProfile | Your profile, favorites, recents, friends |
| FavoritesScreen | Your saved restaurants |
| RecentsScreen | Restaurants from past sessions |
| FriendsScreen | Manage your friends |
| FriendRequestsScreen | Accept or decline incoming requests |
| SearchUsersScreen | Find and add new friends |
| OtherUserProfileScreen | View another user's profile |
| GroupScreen | Create and manage saved friend groups |

---

## Environment Notes

- The frontend auto-detects the backend IP using Expo's `hostUri` — no manual IP configuration needed as long as your phone and computer are on the same network.
- JWT tokens are stored in `AsyncStorage` and persist between app launches.
- Restaurant data from Geoapify is stored in the local database after the first search to support vote tracking.
