# Collaboration Platform

A comprehensive web-based collaboration platform for project management, issue tracking, team communication, and notifications. Built with a Django REST Framework backend and React frontend, this platform enables teams to manage projects, track issues, communicate via chat rooms, and stay updated with real-time notifications.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [User Roles](#user-roles)
- [Development](#development)
- [Contributing](#contributing)

---

## ✨ Features

### 👥 User Management
- User registration and authentication with JWT tokens
- Role-based access control (Admin, Maintainer, Developer, Viewer)
- User profiles with bio and role information
- User directory and profile pages

### 📁 Project Management
- Create, read, update, and delete projects
- Project ownership and member management
- Project timelines with start/end dates
- Budget tracking with funds allocation
- Project progress monitoring
- Project-specific dashboards

### 🐛 Issue Tracking
- Create and manage issues within projects
- Issue assignment to team members
- Priority levels (Low, Medium, High)
- Status tracking (Open, In Progress, Closed)
- Comment system for issue discussions
- Issue filtering and search capabilities
- Activity tracking with timestamps

### 💬 Team Communication
- Real-time chat functionality
- Multiple chat room types (Project, Direct Message, Group)
- Chat room membership management
- Message read status tracking
- Chat history preservation

### 🔔 Notifications
- Real-time notification system
- Multiple notification types:
  - Issue assignments
  - Issue comments
  - Issue status changes
  - Project membership
  - General notifications
- Read/unread status tracking
- Notification center for all updates

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Django 5.2.6
- **API**: Django REST Framework
- **Authentication**: JWT (JSON Web Tokens) via `rest_framework_simplejwt`
- **Database**: SQLite (development)
- **CORS**: django-cors-headers
- **Filtering**: django-filter

### Frontend
- **Framework**: React 19.1.1
- **Routing**: React Router DOM 7.9.1
- **HTTP Client**: Axios 1.12.2
- **Build Tool**: Create React App (react-scripts 5.0.1)
- **Styling**: CSS Modules with custom design system

---

## 📁 Project Structure

```
collab-platform/
├── backend/                   # Django backend application
│   ├── core/                  # Django project settings and configuration
│   │   ├── settings.py        # Main settings file
│   │   ├── urls.py            # Root URL configuration
│   │   ├── wsgi.py            # WSGI configuration
│   │   └── asgi.py            # ASGI configuration
│   ├── users/                 # User management app
│   │   ├── models.py          # User model with roles
│   │   ├── views.py           # User ViewSet
│   │   ├── serializers.py     # User serializers
│   │   └── api.py             # JWT authentication endpoints
│   ├── projects/              # Project management app
│   │   ├── models.py          # Project model
│   │   ├── views.py           # Project ViewSet
│   │   └── serializers.py     # Project serializers
│   ├── issues/                # Issue tracking app
│   │   ├── models.py          # Issue and Comment models
│   │   ├── views.py           # Issue and Comment ViewSets
│   │   └── serializers.py     # Issue and Comment serializers
│   ├── chat/                  # Chat functionality app
│   │   ├── models.py          # ChatRoom and Message models
│   │   ├── views.py           # Chat ViewSets
│   │   └── serializers.py     # Chat serializers
│   ├── notifications/         # Notifications app
│   │   ├── models.py          # Notification model
│   │   ├── views.py           # Notification ViewSet
│   │   └── serializers.py     # Notification serializers
│   ├── manage.py              # Django CLI
│   └── db.sqlite3             # SQLite database
│
├── frontend/                  # React frontend application
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── api/               # API service layer
│   │   │   ├── api.js         # Axios instance and auth
│   │   │   └── services/      # API service modules
│   │   ├── components/        # Reusable React components
│   │   │   ├── Navbar.js      # Navigation bar
│   │   │   ├── ProtectedRoute.js  # Route protection
│   │   │   └── ...            # Other components
│   │   ├── context/           # React Context providers
│   │   │   └── ToastContext.js  # Toast notifications
│   │   ├── pages/             # Page components
│   │   │   ├── Home.js        # Dashboard/Home page
│   │   │   ├── Login.js       # Login page
│   │   │   ├── Register.js    # Registration page
│   │   │   ├── Projects.js    # Projects list
│   │   │   ├── ProjectDetail.js  # Project details
│   │   │   ├── Issues.js      # Issues list
│   │   │   ├── IssueDetail.js # Issue details
│   │   │   ├── IssueForm.js   # Create/Edit issue
│   │   │   ├── Chats.js       # Chat interface
│   │   │   ├── Notifications.js  # Notifications center
│   │   │   ├── Users.js       # Users directory
│   │   │   └── UserDetail.js  # User profile
│   │   ├── App.js             # Main app component with routing
│   │   ├── index.js           # React entry point
│   │   └── index.css          # Global styles
│   ├── package.json           # Frontend dependencies
│   └── README.md              # Create React App documentation
│
└── .git/                      # Git repository
```

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

- **Python**: 3.11 or higher
- **Node.js**: 16.x or higher
- **npm**: 8.x or higher
- **Git**: For version control

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd collab-platform
```

### 2. Backend Setup

#### Create Virtual Environment

```bash
cd backend
python -m venv .venv
```

#### Activate Virtual Environment

**Windows:**
```bash
.venv\Scripts\activate
```

**macOS/Linux:**
```bash
source .venv/bin/activate
```

#### Install Dependencies

```bash
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers django-filter
```

#### Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

#### Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

---

## ⚙️ Configuration

### Backend Configuration

The backend is configured via `backend/core/settings.py`. Key settings include:

- **Database**: SQLite (default) at `backend/db.sqlite3`
- **JWT Token Lifetime**: 60 minutes (access), 7 days (refresh)
- **CORS**: Configured to allow `http://localhost:3000` (React dev server)
- **Pagination**: 20 items per page

### Frontend Configuration

Create a `.env` file in the `frontend` directory if you need to customize the API URL:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

---

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend
python manage.py runserver
```

The backend will be available at: `http://localhost:8000`

- **API Base URL**: `http://localhost:8000/api/`
- **Admin Panel**: `http://localhost:8000/admin/`

### Start Frontend Development Server

```bash
cd frontend
npm start
```

The frontend will be available at: `http://localhost:3000`

The page will automatically reload when you make changes.

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register/` | Register a new user |
| `POST` | `/api/auth/login/` | Login and get JWT tokens |
| `POST` | `/api/auth/refresh/` | Refresh access token |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users/` | List all users |
| `GET` | `/api/users/{id}/` | Get user details |
| `PUT` | `/api/users/{id}/` | Update user |
| `DELETE` | `/api/users/{id}/` | Delete user |

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/projects/` | List all projects |
| `POST` | `/api/projects/` | Create a new project |
| `GET` | `/api/projects/{id}/` | Get project details |
| `PUT` | `/api/projects/{id}/` | Update project |
| `DELETE` | `/api/projects/{id}/` | Delete project |

### Issues

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/issues/` | List all issues |
| `POST` | `/api/issues/` | Create a new issue |
| `GET` | `/api/issues/{id}/` | Get issue details |
| `PUT` | `/api/issues/{id}/` | Update issue |
| `DELETE` | `/api/issues/{id}/` | Delete issue |

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/comments/` | List all comments |
| `POST` | `/api/comments/` | Create a comment |
| `GET` | `/api/comments/{id}/` | Get comment details |
| `DELETE` | `/api/comments/{id}/` | Delete comment |

### Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/chat-rooms/` | List all chat rooms |
| `POST` | `/api/chat-rooms/` | Create a chat room |
| `GET` | `/api/chat-rooms/{id}/` | Get chat room details |
| `GET` | `/api/messages/` | List messages |
| `POST` | `/api/messages/` | Send a message |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notifications/` | List user notifications |
| `PUT` | `/api/notifications/{id}/` | Mark as read |

---

## 👤 User Roles

The platform supports four user roles with different permission levels:

1. **Admin**: Full access to all features and administrative functions
2. **Maintainer**: Can manage projects and issues
3. **Developer**: Can create and work on issues
4. **Viewer**: Read-only access to projects and issues

Roles are assigned during user registration and can be updated by administrators.

---

## 💻 Development

### Backend Development

**Running Tests:**
```bash
cd backend
python manage.py test
```

**Create New App:**
```bash
python manage.py startapp app_name
```

**Django Admin:**

Access the Django admin panel at `http://localhost:8000/admin/` to manage database records directly.

### Frontend Development

**Running Tests:**
```bash
cd frontend
npm test
```

**Build for Production:**
```bash
npm run build
```

**Code Style:**

The project uses standard React conventions and CSS Modules for styling. Each component has its own `.module.css` file for scoped styling.

### API Development

- All API endpoints use JWT authentication (except registration and login)
- Include the Authorization header: `Bearer <access_token>`
- API follows RESTful conventions
- Filtering, searching, and ordering are available on list endpoints

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PRs

---

## 📝 License

This project is developed for educational and collaborative purposes.

---

## 🙏 Acknowledgments

- Built with [Django](https://www.djangoproject.com/)
- Frontend powered by [React](https://reactjs.org/)
- Authentication via [Simple JWT](https://django-rest-framework-simplejwt.readthedocs.io/)
- Created with [Create React App](https://create-react-app.dev/)

---

## 📞 Support

For issues, questions, or contributions, please open an issue in the repository or contact the development team.

---

**Happy Collaborating! 🚀**
