# InterviewPilot

AI-powered mock interview platform to help you prepare for technical and behavioral interviews at top tech companies.

## Features

- **AI-Generated Questions** - Dynamic interview questions tailored to your target role, company, and difficulty level
- **Real-time Evaluation** - Get instant AI feedback on your answers with scores, strengths, and areas for improvement
- **Multiple Interview Types** - Technical, Behavioral, HR, System Design, DSA, and Mixed formats
- **Detailed Reports** - Comprehensive performance reports with skill breakdowns and personalized improvement plans
- **Voice Support** - Optional voice input for a more realistic interview experience
- **Progress Tracking** - Track your performance over time with analytics dashboard
- **Timed Sessions** - Practice under time pressure with configurable question timers

## Tech Stack

### Frontend
- React 19 with Vite
- Tailwind CSS 4
- Zustand (State Management)
- Recharts (Analytics)
- Framer Motion (Animations)
- React Router DOM

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Google Gemini AI API
- JWT Authentication
- Helmet & CORS (Security)

## Prerequisites

- Node.js 20 or later
- MongoDB (local or Atlas)
- Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd ai-interview
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file in the server directory:

```env
NODE_ENV=development
PORT=8000
MONGODB_URI=mongodb://localhost:27017/ai-interview-simulator
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_super_secret_jwt_key_256_bits_change_this
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_change_this
REFRESH_TOKEN_EXPIRES_IN=30d
CORS_ORIGIN=http://localhost:5173
```

### 3. Setup Frontend

```bash
cd ../client
npm install
```

The client `.env` file is pre-configured:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=InterviewPilot
```

## Running the Application

### Development Mode

Start the backend server:

```bash
cd server
npm run dev
```

In a new terminal, start the frontend:

```bash
cd client
npm run dev
```

Access the app at: **http://localhost:5173**

### Production Build

```bash
# Build frontend
cd client
npm run build

# Start production server
cd ../server
npm start
```

## Project Structure

```
ai-interview/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API client functions
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand state stores
│   │   └── utils/         # Utility functions
│   └── ...
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/        # Environment & database config
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic & AI service
│   │   └── utils/         # Utility classes
│   └── server.js          # Entry point
│
└── README.md
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/auth/refresh-token` | Refresh access token |
| GET | `/api/auth/me` | Get current user |
| PATCH | `/api/auth/update-profile` | Update user profile |
| POST | `/api/auth/change-password` | Change password |

### Interviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/interviews/start` | Start new interview |
| GET | `/api/interviews/:sessionId` | Get interview details |
| PATCH | `/api/interviews/:sessionId/answer` | Submit answer |
| PATCH | `/api/interviews/:sessionId/skip` | Skip question |
| POST | `/api/interviews/:sessionId/end` | End interview |
| GET | `/api/interviews/history` | Get interview history |
| DELETE | `/api/interviews/:sessionId` | Delete interview |

### AI Assistance
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/hint` | Get hint for question |
| GET | `/api/ai/follow-up` | Get follow-up question |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/:reportId` | Get detailed report |
| GET | `/api/reports/user/all` | Get all user reports |
| GET | `/api/reports/stats/overview` | Get stats overview |

## Interview Types

- **Technical** - Data structures, algorithms, system design
- **HR** - Cultural fit, salary negotiation, career goals
- **Behavioral** - STAR method, leadership, teamwork scenarios
- **System Design** - Architecture, scalability, trade-offs
- **DSA** - Data structures & algorithms focused
- **Mixed** - Combination of all types

## Screenshots

*Coming soon*

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for powering the AI features
- [Lucide Icons](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for styling
