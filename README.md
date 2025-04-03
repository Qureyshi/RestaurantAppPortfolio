# Restaurant Website

A modern restaurant website built with React for the front-end, Bootstrap for styling, and Django for the back-end. This web application allows users to view the restaurant's menu, place orders, and interact with the restaurant's services.

## Features

- **User Interface (UI)**: Responsive, clean, and modern UI built with **React** and **Bootstrap**.
- **Backend**: **Django** framework for handling user requests, managing the menu, and processing orders.
- **Order Management**: Allows users to browse menu items, add to cart, and place orders.
- **Authentication**: Secure login and user authentication.

## Technologies Used

- **Frontend**:
  - React
  - Bootstrap
    
- **Backend**:
  - Python
  - Django
  - SQLite  
  
 
  
## Installation

### 1. Clone the repository
Frontend setup (React)
```bash
git clone https://github.com/HolbieEnjoyer/RestaurantAppPortfolio.git
cd RestaurantAppPortfolio
cd frontend
npm install
npm run dev
  
Backend setup (Django)
```bash
git clone https://github.com/HolbieEnjoyer/RestaurantAppPortfolio.git
cd RestaurantAppPortfolio
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py runserver

Folder Structure
```bash
restaurant-website/
├── frontend/                # React app
│   ├── public/
│   └── src/
│       ├── components/      # React components
│       ├── App.js           # Main app component
│       └── index.js         # Entry point
├── backend/                 # Django app
│   ├── restaurant/          # Django app for restaurant-related models
│   ├── manage.py            # Django management script
│   └── settings.py          # Django settings file
└── README.md
 

![localhost_5173_menu](https://github-production-user-asset-6210df.s3.amazonaws.com/159009151/430113556-f93b9b84-a16e-4a78-925b-a18f237acbf7.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250403%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250403T194249Z&X-Amz-Expires=300&X-Amz-Signature=07410787c217048e439ea4b6518e5fd402be2e6f3da908e3a15eac64f4fd6daf&X-Amz-SignedHeaders=host)


