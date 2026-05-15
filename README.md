# 🍔 Canteen Hub

A premium, modern, and highly responsive **Canteen Management System** built with a full-stack architecture. Features an ultra-premium glassmorphism UI, a unified role-based authentication portal, intelligent dietary filtering, and an integrated complaint resolution system.

---

## 🌟 Key Features

- **Unified Portal Access**: A single, sleek authentication page intelligently routes users (Admin/Student) based on backend verification.
- **Dynamic Student Dashboard**: 
  - Ultra-modern menu browsing with real-time stock indicators.
  - Smart dietary tags (🟩 Veg, 🟥 Non-Veg, 🌾 Gluten-Free, 🔥 Spicy, ✨ Special Combo).
  - Floating dynamic cart with an integrated QR/Token generating system.
- **Admin Command Center**:
  - Full CRUD capabilities for menu management.
  - Live order tracking and fulfillment metrics.
  - Student complaint resolution center.
- **Premium Aesthetics**: Developed utilizing glassmorphism, dynamic gradients, Tailwind CSS animations, and a seamless Dark/Light mode engine.
- **Scalable Architecture**: Angular (Standalone) on the front-end communicating with a secure Node.js & MongoDB backend via REST APIs.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Angular 18 (Standalone Components)
- **Styling**: Tailwind CSS, Vanilla CSS for Glassmorphism
- **Routing**: Angular Router

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT & Bcryptjs

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- Angular CLI
- MongoDB Atlas Account (or Local MongoDB)

### 1. Clone the repository
```bash
git clone https://github.com/Ihsan710/canteen-hub.git
cd canteen-hub
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory with the following credentials:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```
Start the backend server:
```bash
npm start
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run start
```
The frontend will be available at `http://localhost:4200`.

---

## 🛡️ License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.
