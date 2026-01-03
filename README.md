# admin-vue

An enterprise-level management system frontend project based on Vue3 + SpringBoot3, providing comprehensive user permission management and business data management functionality.

## 📋 Project Overview

This is a modern enterprise-level management system frontend built with Vue3 + Element Plus, implementing core features including user authentication, permission control, data statistics, department management, article management, employee management, and more. The system features an elegant interface with user-friendly interactions, suitable for daily management needs of small to medium-sized enterprises.

## 🛠 Tech Stack

- **Frontend Framework**: Vue 3
- **UI Component Library**: Element Plus
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **Chart Library**: ECharts
- **Rich Text Editor**: WangEditor
- **Build Tool**: Vite
- **Authentication**: JWT Token

## 🚀 Quick Start

### Requirements

- Node.js ^20.19.0 || >=22.12.0
- npm or yarn

### Install Dependencies

```sh
npm install
```

### Development

```sh
npm run dev
```

### Production Build

```sh
npm run build
```

### Preview Build

```sh
npm run preview
```

## 📁 Project Structure

```
src/
├── assets/         # Static resources
├── components/     # Common components
├── router/         # Route configuration
├── stores/         # State management
├── utils/          # Utility functions
└── views/          # Page components
```

## ✨ Feature Modules

### 🔐 User Authentication

- **User Registration**: New user registration with basic information input
  ![Registration Page](./assets/register.png)
- **User Login**: Support username/email login with JWT Token authentication
  ![Login Page](./assets/login.png)
- **Password Change**: Users can change their login password
  ![Password Change](./assets/password.png)

### 📊 Data Statistics

- **Data Overview**: Provides key system data statistics and visualization charts
  ![Data Statistics](./assets/statistics.png)

### 👥 User Management

- **User List**: View all user information with search and pagination support
  ![User Management](./assets/user.png)
- **User Edit**: Edit user basic information and permissions
  ![User Edit](./assets/user-edit.png)

### 🏢 Department Management

- **Department List**: Manage enterprise department structure
  ![Department Management](./assets/department.png)
- **Add Department**: Create new departments
  ![Add Department](./assets/department-new.png)

### 👤 Employee Management

- **Employee List**: Manage employee basic information
  ![Employee Management](./assets/employee.png)
- **Employee Edit**: Edit detailed employee information
  ![Employee Edit](./assets/employee-edit.png)

### 📝 Article Management

- **Article List**: Manage and publish article content
  ![Article Management](./assets/article.png)
- **Add Article**: Create and publish new articles
  ![Add Article](./assets/article-new.png)
- **Article Preview**: Preview article content and formatting
  ![Article Preview](./assets/article-preview.png)

### ℹ️ Personal Center

- **Personal Information**: View and edit personal profile
  ![Personal Information](./assets/info.png)
- **Information Edit**: Update detailed personal information
  ![Information Edit](./assets/info-edit.png)

### 🎯 Admin Dashboard

- **Admin Home**: System management main interface
  ![Admin Dashboard](./assets/admin.png)
- **System Home**: Homepage display after user login
  ![System Homepage](./assets/homepage.png)

## 🔐 Permission Control

The system implements role-based access control:

- **Regular Users**: Can access personal information, password changes, and other basic functions
- **Administrators**: Have access and management permissions for all modules

## 🌐 Backend Project

Companion backend project: [admin-backend](https://github.com/zichuanxu/admin-backend)

## 🤝 Contributing

Issues and Pull Requests are welcome to improve the project.

## 📄 License

This project is open source under the [LICENSE](./LICENSE) agreement.
