# Student Grievance Management System (MERN Stack)

A professional, full-stack web application designed for students to report and track issues related to academics, facilities, or administration.

## 🚀 Features
- **Modern UI**: Dark-themed Glassmorphism design with responsive components.
- **Secure Authentication**: JWT-based auth with hashed passwords using bcrypt.
- **Full CRUD**: Submit, View, Search, Update (Status), and Delete grievances.
- **Interactive Dashboard**: Real-time search and clickable status badges.
- **Deployment Ready**: Configured for Render and MongoDB Atlas.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Axios, Lucide-React.
- **Backend**: Node.js, Express, Mongoose.
- **Database**: MongoDB Atlas.

## 📂 Project Structure
- `/backend`: Express server and MongoDB models.
- `/frontend`: Vite-React application.

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/arnav-gupta-303/Student-Grievance-Management-system.git
cd Student-Grievance-Management-system
```

### 2. Backend Setup
1. Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret
   ```
2. Install dependencies and run:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

### 3. Frontend Setup
1. Update `frontend/src/services/api.js` with your backend URL.
2. Install dependencies and run:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📝 License
This project was developed for the AI Driven Full Stack Development (AI308B) Examination.
