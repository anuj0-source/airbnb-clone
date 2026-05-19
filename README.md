# 🏠 Airbnb Clone

A full-stack Airbnb-inspired web application built with **Node.js**, **Express 5**, **MongoDB**, and **EJS**. Users can browse property listings, save favourites, manage wishlists, and view detailed property pages — while hosts can list, edit, and manage their properties through a dedicated dashboard.

---

## ✨ Features

### 🔐 Authentication & Authorization
- Secure **signup** with server-side validation (`express-validator`) — enforces name, email, password strength, and confirm-password matching
- **Login** with bcrypt-hashed password comparison
- **Session-based auth** stored in MongoDB via `connect-mongodb-session`
- Sessions persist for 7 days with `httpOnly` & `sameSite` cookie flags
- Auth-guard middleware (`isAuth`) protects private routes and returns JSON for AJAX requests

### 👤 User Profiles
- View public profile with listings, favourites count, and member-since date
- Edit profile — update name, change password (with current password verification), upload or remove profile picture
- Profile pictures uploaded to **Cloudinary** with automatic 400×400 face-cropped transformation

### 🏡 Browse & Discover
- Home page displays all available listings (excludes the logged-in user's own listings)
- Detailed property page with image gallery, description, location, price, and host info
- Properties populated with host details via Mongoose `populate()`

### ❤️ Wishlists
- Add / remove properties from wishlist via AJAX (no page reload)
- Dedicated wishlists page to view all saved properties
- Wishlist state reflected across listing cards and detail pages
- Cascade cleanup — when a property is deleted, it's automatically removed from all users' wishlists via Mongoose `pre('findOneAndDelete')` hook

### 🏗️ Host Dashboard
- **Role switching** — seamlessly toggle between Guest (travelling) and Host modes
- **Add listing** — create a new property with name, size, location, price, description, and up to 5 images
- **Edit listing** — update property details (owner-only authorization)
- **Delete listing** — remove property with cascade cleanup (owner-only authorization)
- Home images uploaded to **Cloudinary** with automatic 800×600 cropped transformation

### 🔔 Toast Notifications
- Flash-style toast messages for actions like login, signup, profile update, listing management, and role switching
- Session-based — shown once and automatically cleared

---

## 🏗️ Project Structure

```
airbnb/
├── app.js                          # Entry point — Express config, middleware, routes
│
├── controllers/
│   ├── auth.controller.js          # Signup (with validation chain), login, logout
│   ├── user.controller.js          # Home page, details, wishlists, profile, edit profile
│   ├── host.controller.js          # Add/edit/delete listings, host dashboard
│   └── errors.controller.js        # 404 handler
│
├── middlewares/
│   ├── isAuth.js                   # Auth guard (redirects or returns 401 JSON)
│   ├── toHosting.js                # Switches user role to "host"
│   └── toTravelling.js             # Switches user role to "guest"
│
├── models/
│   ├── user.model.js               # User schema (name, email, password, favourites, listings, profilePic)
│   └── home.model.js               # Home schema (name, size, location, price, images, description, hostId)
│
├── routes/
│   ├── auth.route.js               # GET/POST → /login, /signup, /logout
│   ├── user.route.js               # GET/POST/DELETE → /, /homes/:id, /wishlists, /profile, etc.
│   └── host.route.js               # GET/POST → /host/add-home, /host/listings, /host/edit-home/:id, etc.
│
├── utils/
│   ├── database.js                 # MongoDB connection via Mongoose
│   ├── cloudinaryConfig.js         # Cloudinary SDK configuration
│   └── pathUtil.js                 # Root path helper
│
├── views/
│   ├── store/                      # User-facing pages
│   │   ├── home-list.ejs           # Browse all listings
│   │   ├── home-details.ejs        # Property detail page
│   │   ├── login-page.ejs          # Login form
│   │   ├── signup-page.ejs         # Signup form with inline validation
│   │   ├── wishlists.ejs           # User's saved properties
│   │   ├── bookings.ejs            # Bookings page
│   │   ├── profile.ejs             # Public user profile
│   │   └── edit-profile.ejs        # Edit profile form
│   ├── host/                       # Host dashboard pages
│   │   ├── host-home-list.ejs      # Host's listed properties
│   │   ├── edit-home.ejs           # Add / edit property form
│   │   └── add-home-response.ejs   # Success confirmation
│   ├── partials/                   # Reusable EJS components
│   │   ├── nav-bar.ejs             # Navigation bar
│   │   ├── footer.ejs              # Footer
│   │   ├── global-toast.ejs        # Toast notification component
│   │   ├── wishlist-toast.ejs      # Wishlist action toast
│   │   ├── save-btn.ejs            # Wishlist heart button
│   │   ├── save-script.ejs         # Wishlist AJAX script
│   │   ├── nav-script.ejs          # Navigation scripts
│   │   └── favicon.ejs             # Favicon include
│   └── notfound.ejs                # 404 page
│
├── public/                         # Static assets (CSS, images)
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS config (Tailwind + Autoprefixer)
├── package.json
├── nodemon.json                    # Nodemon config (watches .js, .json, .ejs files)
└── .gitignore
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js |
| **Framework** | Express.js 5 |
| **Templating** | EJS |
| **Database** | MongoDB + Mongoose 9 |
| **Auth** | express-session + connect-mongodb-session + bcrypt |
| **Validation** | express-validator |
| **File Uploads** | Multer + multer-storage-cloudinary |
| **Image Hosting** | Cloudinary |
| **Styling** | Tailwind CSS 3 + PostCSS + Autoprefixer |
| **Dev Tools** | Nodemon, Concurrently, ESLint |

---

## 📡 API Routes

### Auth Routes

| Method | Route | Description |
|---|---|---|
| `GET` | `/login` | Render login page |
| `POST` | `/login` | Authenticate user |
| `GET` | `/signup` | Render signup page |
| `POST` | `/signup` | Register new user (with validation) |
| `POST` | `/logout` | Destroy session & logout |

### User Routes

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/` | ✗ | Home page — browse all listings |
| `GET` | `/homes/:id` | ✗ | Property detail page |
| `GET` | `/wishlists` | ✔ | View user's wishlist |
| `POST` | `/wishlists` | ✔ | Add property to wishlist (AJAX) |
| `DELETE` | `/wishlists` | ✔ | Remove property from wishlist (AJAX) |
| `GET` | `/bookings` | ✔ | View bookings |
| `POST` | `/change-user` | ✔ | Toggle between guest/host role |
| `GET` | `/profile/:userId` | ✔ | View user profile |
| `GET` | `/profile/:userId/edit` | ✔ | Edit profile page (own profile only) |
| `POST` | `/profile/:userId/edit` | ✔ | Submit profile edits (with image upload) |

### Host Routes (all require auth + host role)

| Method | Route | Description |
|---|---|---|
| `GET` | `/host/add-home` | Add new listing form |
| `POST` | `/host/add-home` | Create listing (up to 5 images) |
| `GET` | `/host/listings` | View host's listed properties |
| `GET` | `/host/edit-home/:id` | Edit listing form (owner only) |
| `POST` | `/host/edit-home/:id` | Update listing (owner only) |
| `POST` | `/host/delete/:id` | Delete listing (owner only) |

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas)
- [Cloudinary](https://cloudinary.com/) account (free tier works)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd airbnb
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/airbnb
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

### 4. Start the development server

```bash
npm run dev
```

This runs **both** the Node.js server (via Nodemon) and the Tailwind CSS watcher concurrently.

The app will be available at **http://localhost:3000**

### Other scripts

```bash
npm start              # Production start (node app.js)
npm run tailwind        # Run only the Tailwind CSS watcher
```

---

## 🗂️ Data Models

### User

| Field | Type | Details |
|---|---|---|
| `firstName` | String | Required |
| `lastName` | String | Optional |
| `email` | String | Required, unique |
| `password` | String | Required, bcrypt-hashed |
| `userType` | String | `"guest"` (default) or `"host"` |
| `favourites` | ObjectId[] | Ref → Home |
| `listings` | ObjectId[] | Ref → Home |
| `profilePic` | String | Cloudinary URL (default avatar provided) |

### Home

| Field | Type | Details |
|---|---|---|
| `houseName` | String | Required |
| `size` | String | Required |
| `location` | String | Required |
| `price` | Number | Required |
| `homeImages` | String[] | Required, Cloudinary URLs |
| `homeDescription` | String | Optional |
| `hostId` | ObjectId | Ref → User |

---

## 👤 Author

**Anuj**

---

## 📄 License

ISC
