# Project Title
- notes-api

📝 Description

notes-app-api is a RESTful API built with Node.js, Express, and MongoDB, designed to power a simple notes application. It features secure user authentication, email OTP verification, JWT-based authorization, and protected CRUD routes for managing notes.

🚀 Features
- User Signup with name, email, phone, and password
- Email OTP verification for new users
- JWT-based Login
- Hashed passwords using bcrypt
- Protected note routes using authentication middleware
- Environment configuration with .env

📁 Folder Structure
notes-app-api/
│
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── app.js
│
├── .env
├── .gitignore
├── package.json
└── README.md


⚙️ Installation & Setup
# 1. Clone the repo

git clone https://github.com/WelldoneEsu/notes-app-api.git
cd notes-app-api


2. Install dependencies
npm install

3. Create a .env file
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret
- EMAIL_USER=your_email@example.com
- EMAIL_PASS=your_email_password_or_app_token


4. Run the app

npm run dev   # if using nodemon
# or
node server.js

 ## Usage 
 npm start

📦 Dependencies
- npm install express mongoose bcrypt jsonwebtoken dotenv express-validator nodemailer


## Author
Welldone Esu 

---
API Endpoints
Authentication
Method	Endpoint	Body	Description
POST	/api/auth/signup	{ name, email, phone, password }	Register a new user; sends OTP to email
POST	/api/auth/verify-email-otp	{ email, otp }	Verify email using OTP
POST	/api/auth/login	{ email, password }	Login; returns JWT token
Notes (Protected; require Authorization: Bearer <token>)
Method	Endpoint	Query / Body	Description
POST	/api/notes	{ title, content, tags? }	Create a new note
GET	/api/notes	optional query params: tag=tagName or tags=tag1,tag2,...	Retrieve all notes of logged-in user, optionally filtered by tag(s)
GET	/api/notes/:id	—	Retrieve a single note by ID
PUT	/api/notes/:id	any of { title, content, tags }	Update a note (if owner)
DELETE	/api/notes/:id	—	Delete a note by ID (if owner)
Request Examples

## Create Note
POST /api/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Work Plan",
  "content": "Finish task A, then B",
  "tags": ["work", "urgent"]
}


## Get notes with a tag filter
GET /api/notes?tag=work
Authorization: Bearer <token>


## Get notes with multiple tags
GET /api/notes?tags=work,urgent
Authorization: Bearer <token>

## Security
HTTP headers secured via Helmet middleware
Rate limiting on login route: max ~5 login attempts per IP per 15 minutes
Input validation on all routes to prevent malformed data

## Frontend

Static frontend is in public/index.html. It provides:
a login form
form to create notes
a section that displays your notes (after login)

## To use:
Open public/index.html in browser (or run the server and visit the root /)
Login, then create notes and view them

---

📌 .gitignore

- node_modules/
- .env


🛠️ Tech Stack

- Node.js
- Express
- MongoDB & Mongoose
- JWT
- Bcrypt
- Nodemailer (for OTP)
- dotenv

🤝 License
# This project is open-source and available under the MIT License.



##  Third commit and Push

git add .
git commit -m "feat:..."
git push origin main