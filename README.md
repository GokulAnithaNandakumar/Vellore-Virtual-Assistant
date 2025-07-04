# 🏛️ Vellore Virtual Assistant

A comprehensive AI-powered virtual assistant specifically designed to help tourists and travelers explore Vellore city and its district. The assistant provides intelligent, context-aware responses about tourist attractions, local culture, travel tips, and places to visit in and around Vellore, Tamil Nadu, India.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

The Vellore Virtual Assistant is a multi-component system that combines modern web technologies with advanced AI capabilities to create an intelligent travel companion for Vellore district. The system uses Retrieval-Augmented Generation (RAG) with local LLM models to provide accurate, contextual information about:

- **Tourist Attractions**: Vellore Fort, Sripuram Golden Temple, Yelagiri Hills, Amirthi Zoological Park
- **Local Culture**: Traditional practices, festivals, and customs
- **Travel Information**: Transportation, accommodation, dining options
- **Historical Context**: Rich heritage of Vellore and surrounding areas

## ✨ Features

### 🤖 Intelligent Conversational AI
- **Context-Aware Responses**: Maintains conversation context and provides relevant follow-up information
- **Domain-Specific Knowledge**: Strictly focused on Vellore and its district (refuses off-topic queries)
- **RAG-Powered**: Uses vector embeddings and document retrieval for accurate information

### 🔐 User Management
- **Authentication System**: Secure user registration and login
- **Chat History**: Persistent conversation storage and retrieval
- **User Sessions**: Personalized experience with saved preferences

### 🌐 Multi-Platform Access
- **Web Interface**: Modern, responsive React-based frontend
- **REST API**: FastAPI backend for direct integration
- **Command Line**: Interactive terminal-based chat interface

### 📱 Modern UI/UX
- **Material-UI Design**: Clean, intuitive interface using MUI components
- **Real-time Chat**: Live messaging with typing indicators and timestamps
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🏗️ Architecture

The system follows a microservices architecture with three main components:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │  AI Assistant   │
│   (Next.js)     │◄──►│   (Spring Boot) │◄──►│   (FastAPI)     │
│                 │    │                 │    │                 │
│ - React UI      │    │ - User Auth     │    │ - LLM (Llama3)  │
│ - Chat Interface│    │ - Chat History  │    │ - RAG System    │
│ - Material-UI   │    │ - REST APIs     │    │ - Vector DB     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.3.4 with React 19
- **Styling**: Tailwind CSS + Material-UI (MUI)
- **Language**: TypeScript
- **Icons**: Tabler Icons, MUI Icons
- **Date Handling**: date-fns

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.5.3
- **Language**: Java
- **Security**: Spring Security with JWT
- **Database**: JPA/Hibernate (configurable)
- **Build Tool**: Maven

### AI Engine
- **Framework**: FastAPI
- **Language**: Python
- **LLM**: Ollama (Llama3 model)
- **RAG**: LangChain with FAISS vector store
- **Embeddings**: Ollama embeddings
- **Knowledge Base**: Text files + structured data

### Infrastructure
- **Containerization**: Ready for Docker deployment
- **API Communication**: REST APIs with JSON
- **Authentication**: JWT-based security

## 📁 Project Structure

```
Vellore-Virtual-Assistant/
├── README.md
├── frontend/                          # Next.js Frontend Application
│   ├── package.json
│   └── assistant-frontend/
│       ├── src/
│       │   ├── app/
│       │   │   ├── chat/             # Chat interface components
│       │   │   ├── login/            # Authentication pages
│       │   │   ├── register/
│       │   │   └── api/              # API route handlers
│       │   └── types.ts              # TypeScript definitions
│       ├── public/                   # Static assets
│       └── package.json
│
├── assistant-api-backend/            # Spring Boot Backend
│   ├── pom.xml                      # Maven configuration
│   ├── src/
│   │   └── main/
│   │       ├── java/com/virtualassistant/api/
│   │       │   ├── AssistantApiApplication.java
│   │       │   ├── controller/       # REST controllers
│   │       │   │   ├── AuthController.java
│   │       │   │   └── ChatController.java
│   │       │   ├── model/           # Data models
│   │       │   ├── repository/      # Data access layer
│   │       │   ├── service/         # Business logic
│   │       │   └── config/          # Configuration classes
│   │       └── resources/
│   │           └── application.properties
│   └── target/                      # Compiled artifacts
│
└── virtual-agent/                   # Python AI Engine
    ├── vellore_assistant.py         # Main RAG chat system
    ├── assistant_api.py             # FastAPI server
    ├── vellore_knowledge.py         # Structured knowledge base
    ├── scrape_wikipedia_to_txt.py   # Data collection utilities
    └── data/                        # Knowledge base files
        ├── vellore_info.txt
        ├── vellore_wiki.txt
        └── README.txt
```

## 🚀 Installation & Setup

### Prerequisites

- **Python 3.9+** (for AI engine)
- **Node.js 18+** (for frontend)
- **Java 17+** (for backend)
- **Maven 3.6+** (for Java build)
- **Ollama** (for local LLM)

### 1. Clone the Repository

```bash
git clone https://github.com/GokulAnithaNandakumar/Vellore-Virtual-Assistant.git
cd Vellore-Virtual-Assistant
```

### 2. Setup AI Engine (Python)

```bash
cd virtual-agent

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn langchain langchain-ollama langchain-community faiss-cpu

# Install and setup Ollama
# Visit https://ollama.ai for installation instructions
ollama pull llama3

# Test the assistant
python vellore_assistant.py

# Start the FastAPI server
python assistant_api.py
```

### 3. Setup Backend (Spring Boot)

```bash
cd assistant-api-backend

# Configure application properties
cp src/main/resources/application.properties.template src/main/resources/application.properties

# Edit application.properties with your actual credentials:
# - MongoDB connection string
# - JWT secret key
# ⚠️ NEVER commit application.properties to version control!

# Build the project
./mvnw clean install

# Run the application
./mvnw spring-boot:run

# The server will start on http://localhost:8080
```

### 4. Setup Frontend (Next.js)

```bash
cd frontend/assistant-frontend

# Install dependencies
npm install

# Start development server
npm run dev

# The frontend will be available at http://localhost:3000
```

## 💬 Usage

### Command Line Interface

For quick testing and development:

```bash
cd virtual-agent
python vellore_assistant.py
```

Example conversation:
```
You: Tell me about Vellore Fort
Assistant: Vellore Fort is a magnificent 16th-century fort built by the Vijayanagara kings...

You: What about nearby attractions?
Assistant: Near Vellore Fort, you can visit the Jalakanteswarar Temple inside the fort...
```

### Web Interface

1. **Register/Login**: Create an account or login at `http://localhost:3000/login`
2. **Start Chatting**: Navigate to `/chat` to begin conversations
3. **Chat History**: View previous conversations and continue where you left off

### API Integration

Direct API access via FastAPI:

```bash
curl -X POST "http://localhost:5001/ask" \
     -H "Content-Type: application/json" \
     -d '{"message": "What are the top attractions in Vellore?"}'
```

## 📚 API Documentation

### FastAPI Endpoints (Port 5001)

#### POST /ask
Chat with the AI assistant

**Request:**
```json
{
  "message": "Your question about Vellore"
}
```

**Response:**
```json
{
  "answer": "AI assistant's response"
}
```

### Spring Boot Endpoints (Port 8080)

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

#### Chat Management
- `GET /chats` - Get user's chat history
- `POST /chats` - Create new chat
- `GET /chats/history` - Get message history
- `GET /chats/history/updates` - Get recent updates

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Areas for Contribution

1. **Knowledge Base Expansion**: Add more information about Vellore attractions
2. **UI/UX Improvements**: Enhance the frontend interface
3. **Performance Optimization**: Improve response times and efficiency
4. **Multi-language Support**: Add Tamil language support
5. **Mobile App**: Native mobile application development

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style

- **Python**: Follow PEP 8 guidelines
- **Java**: Follow Google Java Style Guide
- **TypeScript/JavaScript**: Use Prettier and ESLint configurations
- **Commit Messages**: Use conventional commit format

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Vellore Tourism Department** for providing local insights
- **OpenAI Community** for RAG implementation patterns
- **Ollama Project** for local LLM capabilities
- **Contributors** who help improve this project

## 📞 Support

For questions, issues, or suggestions:

- **Issues**: [GitHub Issues](https://github.com/GokulAnithaNandakumar/Vellore-Virtual-Assistant/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/Vellore-Virtual-Assistant/discussions)
- **Email**: gokul.nandakumar04@gmail.com

---

**Made with ❤️ for Vellore Tourism**

*Explore Vellore with AI-powered assistance!*