🏗️ PlotNest – Real Estate Plot Management Platform


A full-stack web application for managing real estate plots, users, dealers, and inquiries. PlotNest allows buyers, sellers, and dealers to interact, manage listings, and facilitate deals in the construction and real estate domain.

🔗 Live Demo: https://plotnest.vercel.app

📑 Table of Contents
Features

Tech Stack

Project Structure

Getting Started

Prerequisites

Installation

Running the Application

Scripts

Contributing

🚀 Features:

✅ User Authentication (Buyers, Sellers, Dealers, Admins)

📋 Plot Listing, Browsing, and Detailed Views

💬 Inquiry & Booking Management

🤝 Dealer Matchmaking for Plots

🛠️ Admin Dashboard to Manage Everything

📱 Responsive UI with Modern Design

💬 Real-time Chat for Deals (optional, if implemented)

🔐 Role-Based Access Control

🛠️ Tech Stack
Frontend:

React

Vite

Tailwind CSS

React Router

Axios

React Icons

Backend:

Node.js

Express

Database:

MongoDB (can be changed as per use)

🗂️ Project Structure

✳️ Frontend
src/components/ – Reusable UI components (Navbar, Footer, etc.)

src/pages/ – Route-based page components

admin/ – Admin views

dealer/ – Dealer dashboard

seller/ – Seller dashboard

buyer/ – Buyer views

src/config/ – Axios API configuration

⚙️ Backend
models/ – Mongoose models (User, Plot, Booking, etc.)

routes/ – API route handlers

utils/ – Middleware and helper utilities

uploads/ – Uploaded images or files

🧰 Getting Started

✅ Prerequisites :

Node.js (v14 or newer)

npm

MongoDB (running locally or using cloud connection string)

📥 Installation
Clone the repository:


git clone : [https://github.com/yourusername/plotnest.git](https://github.com/ritesh6569/PLOTNEST)
cd plotnest
Install dependencies for both client and server:

cd client
npm install

cd ../server
npm install

▶️ Running the Application
Start Backend (Server):

cd server
npm run dev
By default, the backend runs on http://localhost:5000.

Start Frontend (Client):

cd client
npm run dev
By default, the frontend runs on http://localhost:5173.


📜 Scripts
Client
Command	Description
npm run dev : 	Start Vite development server
npm run build :	Create production build
npm run preview	Preview production build locally

Server
Command	Description
npm start	Start Express server (without dev)
npm run dev	Start server with nodemon (auto-reload)

🤝 Contributing
We welcome contributions!

Fork the repo

Create a new branch:

git checkout -b feature/YourFeature

Commit your changes:
it commit -am 'Add new feature'

Push to GitHub:

git push origin feature/YourFeature

Open a Pull Request

