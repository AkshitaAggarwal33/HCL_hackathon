 README.md
 Health & Wellness Preventive Care Portal

A full-stack MERN web application that helps patients track daily wellness goals and allows health providers to monitor patient progress through an intuitive dashboard.
The portal also offers public health information accessible without login.

 Features
 Patient Features

Register & Login with JWT authentication

Track today's wellness goals:

Steps

Water intake

Sleep hours

Active minutes

View personalized reminders

Tip of the day

Manage personal health profile (allergies, medications)

 Provider Features

View list of all patients

See each patient’s:

Steps today

Goal compliance (Goal Met ≥ 6000 steps)

Open health summary for the last 7 days

View patient details (allergies, medications)

 Public User Features

Access general health information (COVID-19, Flu, Mental Health)

 Tech Stack
 Frontend

React (Vite)

React Router DOM

Axios

Context API (AuthContext)

CSS (custom utility classes)

 Backend

Node.js

Express.js

JWT Authentication

Role-based Access Control (RBAC)

Mongoose ODM

CORS

Morgan Logger

dotenv

 Database

MongoDB Atlas (Cloud database)

 Folder Structure
HCL_hackathon/
│
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html

API Endpoints Overview
Auth Routes
Method	Endpoint	Description
POST	/api/auth/register	Register patient/provider
POST	/api/auth/login	Login and get JWT
Patient Routes
Method	Endpoint	Description
GET	/api/patient/dashboard	Get today’s goals + reminders + tips
POST	/api/patient/goals	Update/save today's goals
GET	/api/patient/profile	Get patient profile
PUT	/api/patient/profile	Update patient profile
Provider Routes
Method	Endpoint	Description
GET	/api/provider/patients	List all patients with today's compliance
GET	/api/provider/patient/:id	Last 7 days of health data
Public Routes
Method	Endpoint	Description
GET	/api/public/health-info	Public health education cards

 Database Models (Mongoose Schemas)

Below are all MongoDB collections used in the project, defined through Mongoose schemas.

 User Model (User)
{
  _id: ObjectId,
  name: String,                // required
  email: String,               // required, unique
  password: String,            // hashed
  role: "patient" | "provider",
  allergies: String,           // optional
  medications: String,         // optional
  consent: Boolean,            // default: false
  createdAt: Date,
  updatedAt: Date
}


Purpose:
Stores account information for both patients and providers.

 Goal Model (Goal)
{
  _id: ObjectId,
  userId: ObjectId (ref: "User"),   // patient ID
  steps: Number,                    // default: 0
  water: Number,                    // glasses / default 0
  sleep: Number,                    // hours
  activeMinutes: Number,            // default: 0
  date: String,                     // "YYYY-MM-DD"
  createdAt: Date,
  updatedAt: Date
}


Unique Index:

{ userId: 1, date: 1 }  // ensures only one goal entry per user per day


Purpose:
Stores daily wellness data for each patient.

 Activity Model (Activity)
{
  _id: ObjectId,
  userId: ObjectId (ref: "User"),  // the user who performed action
  action: String,                  // "User registered", "Updated goals", etc.
  timestamp: Date,                 // default: now
  createdAt: Date,
  updatedAt: Date
}


Purpose:
Used for logging important user actions (audit trail).
 HealthInfo Model (HealthInfo)
{
  _id: ObjectId,
  title: String,
  text: String,
  createdAt: Date,
  updatedAt: Date
}


Purpose:
Stores static public health information displayed on /public-info.

ER Diagram (Text Format)
User 
  |---< Goal (daily health metrics)
  |
  |---< Activity (audit logs)

HealthInfo (independent)

Contributors & Roles
Backend Development
Shubham Ray (@sbmray)

Responsible for entire backend system, including:

Node.js + Express server

MongoDB database & schema design

Authentication (JWT, passwords, sessions)

Patient & Provider backend APIs

Middleware (auth & roles)

Activity logging

Deployment-ready backend setup

Frontend Development
Akshita Aggarwal (@AkshitaAggarwal33)

Fully developed the following frontend modules:

Login Page

Patient Dashboard Page

Profile Page
Also contributed to:

React Context Authentication Setup

Axios API integration for these pages

Aarti

Developed the following frontend modules:

Provider Dashboard Page

Register Page

Public Info Page
Also contributed to:

UI styling

Page structure and layout polishing
│   └── package.json
│
└── README.md
