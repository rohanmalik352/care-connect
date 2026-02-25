# 🏥 CareConnect
> ⚡ India's unified health platform — secure patient records + doctor collaboration, built with Node.js, Express & MongoDB.

**Unified Patient Records & Doctor Collaboration Platform**  
*Built by Team Parallax*

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/team-parallax/careconnect/blob/main/LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green)](https://mongodb.com/)
[![EJS](https://img.shields.io/badge/Template-EJS-orange)](https://ejs.co/)
[![Render](https://img.shields.io/badge/Hosted%20on-Render-46E3B7)](https://careconnect.onrender.com)

🌐 **Live Demo:** [https://careconnect.onrender.com](https://careconnect.onrender.com)  
📁 **Repository:** [https://github.com/team-parallax/careconnect](https://github.com/team-parallax/careconnect)  
📄 **License:** [MIT](https://github.com/team-parallax/careconnect/blob/main/LICENSE)

---

## 📦 Dependencies to Install

```bash
npm install
```

| Package | Purpose |
|---|---|
| `express` | Web framework |
| `ejs` | Templating engine |
| `mongoose` | MongoDB ODM |
| `passport` + `passport-local` | Authentication |
| `bcryptjs` | Password hashing |
| `express-session` | Session management |
| `connect-mongo` | Store sessions in MongoDB |
| `connect-flash` | Flash messages |
| `method-override` | PUT/DELETE in forms |
| `dotenv` | Environment variables |
| `multer` | File uploads (lab reports) |
| `nodemon` (dev) | Auto-restart on file changes |

---

## 🚀 Setup & Run

### 1. Clone the repository
```bash
git clone https://github.com/team-parallax/careconnect.git
cd careconnect
```

### 2. Install Node.js dependencies
```bash
npm install
```

### 3. Configure environment
Edit `.env` file:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/careconnect
SESSION_SECRET=your_secret_key_here
```

### 4. Make sure MongoDB is running
```bash
# macOS/Linux
mongod

# Windows
net start MongoDB
```

### 5. Seed demo data (optional but recommended)
```bash
npm run seed
```

### 6. Start the server
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

Visit → **http://localhost:3000**

---

## 🔑 Demo Login Credentials (after seeding)

| Role | Email | Password |
|---|---|---|
| Admin | admin@careconnect.in | admin123 |
| Doctor | drrohan@careconnect.in | doctor123 |
| Doctor | drmanvi@careconnect.in | doctor123 |
| Patient | naman@gmail.com | patient123 |
| Patient | aditya@gmail.com | patient123 |

---

## 📁 File Structure

```
careconnect/
├── app.js                    # Entry point
├── package.json
├── .env                      # Environment config
├── config/
│   ├── db.js                 # MongoDB connection
│   └── passport.js           # Auth strategy
├── models/
│   ├── User.js               # Auth user (all roles)
│   ├── Patient.js            # Patient profile
│   ├── Doctor.js             # Doctor profile
│   ├── MedicalRecord.js      # Visit records + prescriptions
│   └── Discussion.js         # Doctor forum posts
├── routes/
│   ├── index.js              # Landing page
│   ├── auth.js               # Login/Register/Logout
│   ├── patient.js            # Patient routes
│   ├── doctor.js             # Doctor routes
│   └── admin.js              # Admin routes
├── middleware/
│   └── auth.js               # Role-based access guards
├── views/
│   ├── index.ejs             # Landing page
│   ├── 404.ejs
│   ├── partials/
│   │   ├── head.ejs
│   │   ├── navbar.ejs
│   │   ├── flash.ejs
│   │   └── footer.ejs
│   ├── auth/
│   │   ├── login.ejs
│   │   └── register.ejs
│   ├── patient/
│   │   ├── dashboard.ejs
│   │   ├── records.ejs
│   │   ├── record-detail.ejs
│   │   └── profile.ejs
│   ├── doctor/
│   │   ├── dashboard.ejs
│   │   ├── search-patient.ejs
│   │   ├── patient-view.ejs
│   │   ├── add-record.ejs
│   │   ├── forum.ejs
│   │   ├── forum-new.ejs
│   │   ├── forum-detail.ejs
│   │   └── profile.ejs
│   └── admin/
│       ├── dashboard.ejs
│       ├── doctors.ejs
│       └── patients.ejs
├── public/
│   ├── css/style.css
│   └── js/main.js
└── seeds/
    └── seed.js               # Demo data seeder
```

---

## 🔐 Role-Based Access

| Feature | Patient | Doctor | Admin |
|---|:---:|:---:|:---:|
| View own records | ✅ | | |
| Update health profile | ✅ | | |
| Search patients | | ✅ | |
| Add medical records | | ✅ | |
| Doctor forum | | ✅ | |
| Verify doctors | | | ✅ |
| View all users | | | ✅ |

---

## 👥 Team Parallax

| Name | Role |
|---|---|
| Rohan Malik | Team Leader |
| Manvi | Developer |
| Khyati Mourya | Developer |
| Naman Chaudhary | Developer |
| Aditya Chandra | Data Analyst |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](https://github.com/team-parallax/careconnect/blob/main/LICENSE) file for full details.

Copyright (c) 2024 Team Parallax
