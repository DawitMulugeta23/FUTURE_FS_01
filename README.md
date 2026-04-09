# Dawit Mulugeta - Portfolio Website

A modern, full-stack portfolio website showcasing my skills, projects, and professional journey as a Computer Science student at Debre Berhan University.

## 🌟 Live Demo

-Portfolio Website:https://dawitmulugeta23.github.io/FUTURE_FS_01/

## ✨ Features

Frontend Features
- 🎨 Modern UI/UX** - Clean, responsive design with smooth animations
- 🌓 Dark/Light Mode** - Toggle between themes for comfortable viewing
- 📱 Fully Responsive** - Optimized for all devices (mobile, tablet, desktop)
- ⚡ Fast Performance** - Built with Vite for optimal loading speeds
- 🔄 Dynamic Content** - All content managed through admin panel
- 📧 Contact Form** - Visitors can send messages directly
- 🏆 Skills Showcase** - Visual progress bars for technical skills
- 📜 Certificates Display** - Showcase achievements and certifications
- 🚀 Projects Gallery** - Display projects with live links and tech stacks

Backend Features
- 🔐 Secure Admin Panel** - Hidden URL path for admin access
- 📁 File Upload** - Upload CV, profile images, project/certificate images via Cloudinary
- 💾 Database Management** - MongoDB Atlas for data persistence
- 📊 CRUD Operations** - Full Create, Read, Update, Delete for all content
- 🔄 Real-time Updates** - Changes reflect immediately on frontend
- 📝 Contact Management** - Store and manage contact form submissions via hiden URL

### Admin Features
- Add/Edit/Delete Projects
- Add/Edit/Delete Skills (with level: Beginner/Intermediate/Advanced/Expert)
- Add/Edit/Delete Certificates
- 🔘 Update Work Status (Open to Work)
- 🖼️ Upload CV and Profile Image
- 🔒 Change Admin URL Path (Security feature)
- 📊 View Contact Messages

## 🛠️ Tech Stack

### Frontend
- React 18 - UI library
- Redux Toolkit - State management
- React Router DOM - Client-side routing
- Tailwind CSS - Styling framework
- Vite - Build tool and dev server
- Axios - HTTP client
- React Redux** - React bindings for Redux

### Backend
- Node.js - Runtime environment
- Express.js - Web framework
- MongoDB Atlas - Cloud database
- Mongoose - ODM for MongoDB
- Cloudinary - Image upload and optimization
- Nodemailer - Email sending (optional)
- Multer - File upload handling
- CORS - Cross-origin resource sharing

### Deployment
- Frontend: GitHub Pages
- Backend: Render.com
- Database: MongoDB Atlas

## 📁 Project Structure
FUTURE_FS_01/
├── frontend/
│ ├── public/
│ │ ├── assets/
│ │ └── 404.html
│ ├── src/
│ │ ├── app/
│ │ │ └── store.js
│ │ ├── assets/
│ │ │ ├── github.png
│ │ │ ├── linkedin.png
│ │ │ ├── telegram.jpg
│ │ │ └── Untitled.jpg
│ │ ├── components/
│ │ │ ├── About.jsx
│ │ │ ├── AdminPanel.jsx
│ │ │ ├── Contact.jsx
│ │ │ ├── Hero.jsx
│ │ │ ├── Navbar.jsx
│ │ │ ├── Projects.jsx
│ │ │ └── Skills.jsx
│ │ ├── features/
│ │ │ └── navSlice.js
│ │ ├── services/
│ │ │ └── api.js
│ │ ├── App.jsx
│ │ ├── App.css
│ │ ├── index.css
│ │ └── main.jsx
│ ├── .env
│ ├── index.html
│ ├── package.json
│ ├── vite.config.js
│ ├── tailwind.config.js
│ └── postcss.config.js
├── backend/
│ ├── server.js
│ ├── .env
│ ├── package.json
│ └── package-lock.json
└── README.md


## 🚀 Installation

### Prerequisites
- Node.js 
- npm
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account

### Clone the Repository

```bash
git clone https://github.com/DawitMulugeta23/FUTURE_FS_01.git
