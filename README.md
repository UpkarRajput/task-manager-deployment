# Task Manager App

A comprehensive full-stack Task Management application built with **Flutter** for the frontend and **Node.js (Express)** for the backend. The application features user authentication, project management, and task tracking, designed to work seamlessly across web and mobile platforms.

### 🔗 GitHub Repositories

- **Frontend:** [https://github.com/UpkarRajput/task-manager-frontend](https://github.com/UpkarRajput/task-manager-frontend)
- **Backend:** [https://github.com/UpkarRajput/task-manager-deployment](https://github.com/UpkarRajput/task-manager-deployment)

## 🚀 Features

- **User Authentication**: Secure Login and Signup using JWT (JSON Web Tokens).
- **Project Management**: Create, view, update, and delete projects.
- **Task Tracking**: Manage tasks within projects efficiently.
- **Responsive Design**: Built with Flutter for a smooth experience on any device.
- **Cloud Integration**: Frontend deployed on Firebase and Backend on Railway.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Flutter](https://flutter.dev/)
- **State Management**: [Provider](https://pub.dev/packages/provider)
- **API Communication**: [HTTP](https://pub.dev/packages/http)
- **Persistence**: [Shared Preferences](https://pub.dev/packages/shared_preferences)
- **Deployment**: [Firebase Hosting](https://firebase.google.com/docs/hosting)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MySQL](https://www.mysql.com/)
- **Authentication**: [JWT](https://jwt.io/) & [Bcryptjs](https://www.npmjs.com/package/bcryptjs)
- **Environment Management**: [Dotenv](https://www.npmjs.com/package/dotenv)
- **Deployment**: [Railway](https://railway.app/)

## 📂 Project Structure

```text
task-manager-app/
├── backend/            # Express.js Backend API
│   ├── routes/         # API Endpoints (Auth, Projects)
│   ├── middleware/     # Auth and validation middleware
│   ├── server.js       # Entry point
│   └── .env            # Environment variables (DB, JWT Secret)
├── frontend/           # Flutter Frontend Application
│   ├── lib/            # Dart source code
│   │   ├── services/   # API and Business logic
│   │   ├── models/     # Data models
│   │   └── main.dart   # App entry point
│   ├── web/            # Web configuration
│   └── firebase.json   # Firebase deployment config
└── README.md           # Project documentation
```

## ⚙️ Getting Started

### Prerequisites
- [Flutter SDK](https://docs.flutter.dev/get-started/install)
- [Node.js & npm](https://nodejs.org/)
- [MySQL Database](https://www.mysql.com/downloads/)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure your variables:
   ```env
   PORT=3000
   DB_HOST=your_host
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=your_db_name
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Fetch Flutter dependencies:
   ```bash
   flutter pub get
   ```
3. Run the application (for Web):
   ```bash
   flutter run -d chrome
   ```

## 🌐 Deployment

### Frontend (Firebase)
The frontend is configured for CI/CD via GitHub Actions to Firebase Hosting.
- Build command: `flutter build web`
- Deploy command: `firebase deploy`

### Backend (Railway)
The backend is automatically deployed from the repository to Railway.

## 📄 License

This project is licensed under the ISC License.
