# 🚀 Node.js Learning Project

A TypeScript-based backend application showcasing best practices in Node.js development. This project demonstrates clean architecture principles with domain-driven design, featuring authentication, HTTP routing, error handling, and dependency injection patterns.

## ✨ Key Features

- 📘 **TypeScript** - Type-safe code and better developer experience
- 🏗️ **Clean Architecture** - Domain-Driven Design (DDD) pattern implementation
- 🔐 **Authentication** - User login use cases and secure handling
- 🛣️ **RESTful APIs** - Express routing with organized controllers
- 🚨 **Error Handling** - Centralized exception management
- ⚙️ **Configuration** - Environment-based setup management
- 📚 **Swagger** - API documentation and interactive testing
- 💉 **Dependency Injection** - Container pattern for service management

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Basic knowledge of TypeScript and Express.js

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nodejs-playground
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory (use `.env.example` as reference if available):
```bash
NODE_ENV=development
PORT=3000
```

## 🚀 Getting Started

### Development Mode
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## 📁 Project Structure

```
src/
├── main.ts                 # Application entry point
├── config/
│   ├── container.ts        # Dependency Injection container
│   ├── environment.ts      # Environment configuration
│   └── swagger.ts          # Swagger/OpenAPI setup
├── domains/
│   └── auth/               # Authentication domain
│       ├── dtos/           # Data Transfer Objects
│       │   └── LoginDTO.ts
│       ├── entities/       # Domain entities
│       │   └── User.ts
│       └── usecases/       # Business logic
│           └── LoginUseCase.ts
├── interfaces/
│   └── http/               # HTTP layer
│       ├── controllers/    # Route handlers
│       │   └── AuthController.ts
│       ├── middleware/     # Express middleware
│       │   └── errorHandler.ts
│       └── routes/         # Route definitions
│           └── auth.routes.ts
└── shared/
    ├── errors/             # Custom error classes
    │   └── AppError.ts
    └── utils/              # Utility functions
```

## 🏛️ Architecture Overview

This project follows **Clean Architecture** principles:

- **Entities**: Core business objects (User)
- **Use Cases**: Business logic and workflows (LoginUseCase)
- **DTOs**: Data transfer between layers (LoginDTO)
- **Controllers**: HTTP request handlers
- **Middleware**: Cross-cutting concerns (error handling)
- **Dependency Injection**: Loose coupling between layers

## 🔑 Key Concepts

### Domain-Driven Design (DDD)
The project is organized around domains (currently `auth`). Each domain contains:
- Entities (business objects)
- DTOs (data contracts)
- Use Cases (business logic)

### Error Handling
Centralized error handling with custom `AppError` class for consistent error responses.

### Dependency Injection
Service container pattern for managing dependencies and promoting testability.

## 📚 Learning Goals

This project is designed to help you learn:
- Clean Architecture principles
- Domain-Driven Design patterns
- TypeScript best practices
- RESTful API design
- Error handling strategies
- Dependency Injection patterns
- Project structure organization

## 🛠️ Technologies Used

- **Node.js** - Runtime
- **TypeScript** - Type-safe JavaScript
- **Express.js** - Web framework
- **Swagger/OpenAPI** - API documentation
- **TSConfig** - TypeScript configuration

## 📝 Environment Variables

Create a `.env` file with the following variables:

```env
NODE_ENV=development
PORT=3000
# Add more as needed
```

## 🤝 Contributing

This is a learning project. Feel free to:
- Add new features
- Improve existing code
- Experiment with new patterns
- Create new domains

## 📖 Resources

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://domainlanguage.com/ddd/)
- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📄 License

This project is open source and available under the MIT License.

---

**Happy Learning! 🎓**
