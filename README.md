# Note Genius

Note Genius is an advanced AI-powered educational assistant designed to transform study materials into concise, easy-to-understand notes. By leveraging the power of Google's Gemini AI, it allows users to upload PDF documents or paste text to generate simplified explanations, bullet points, and important examination questions.

## 🚀 Key Features

*   **AI Summarization**: Instantly converts complex study material into simple language.
*   **PDF Support**: Upload PDF documents directly for analysis.
*   **Exam Prep**: Automatically generates 5-mark and 10-mark questions from the content.
*   **User History**: Saves all your generated notes and study material for future reference.
*   **Secure Authentication**: User accounts with secure login, registration, and **Email Verification**.
*   **Password Management**: Forgot Password and Reset Password functionality via email.
*   **Modern UI**: A responsive, clean interface built with React and Tailwind CSS.
*   **PDF Export**: (Client capability) Export your notes to PDF.

## 📖 End-to-End User Flow

1.  **Authentication**:
    *   Users land on the application and are prompted to **Log In** or **Register**.
    *   New users create an account with Name, Email, and Password.
    *   **Email Verification**: A verification link is sent to the user's email. They must verify their email before logging in.
    *   Authentication is handled securely via JWT (JSON Web Tokens).

2.  **Dashboard**:
    *   Upon login, users are directed to the **Dashboard**.
    *   Here, they can choose to either **Upload a PDF** file or **Paste Text** directly into the input area.

3.  **Content Analysis & Generation**:
    *   The user clicks "Analyze" (or similar action).
    *   The backend extracts text from the PDF (or uses the raw text).
    *   This content is sent to **Google Gemini AI** with a specific prompt to generate:
        *   Simple explanation.
        *   Bullet point notes.
        *   Important 5-mark and 10-mark questions.
    *   While processing, the user sees a loading state.

4.  **Results View**:
    *   Once processed, the AI-generated structured notes are displayed on the screen.
    *   The user can read, review, and study the material.

5.  **History Access**:
    *   All generated notes are automatically saved to the database.
    *   Users can navigate to the **History** page to view a list of all their past analyses and revisit them at any time.

## 💻 Technology Stack

### Frontend
*   **Framework**: React (Vite)
*   **Styling**: Tailwind CSS, Vanilla CSS (with modern gradients/amenities)
*   **Routing**: React Router DOM
*   **HTTP Client**: Axios
*   **Icons**: Lucide React
*   **Utilities**: `html2canvas`, `jspdf` (for client-side PDF generation), `react-hot-toast` (notifications), `react-markdown`.

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database ORM**: Prisma
*   **Database**: PostgreSQL
*   **Authentication**: JSON Web Tokens (JWT), bcryptjs
*   **Email Service**: Nodemailer (Gmail SMTP)
*   **File Handling**: Multer (for uploads), pdf-parse (for server-side PDF text extraction).
*   **AI Integration**: @google/generative-ai (Google Gemini).

## 🛠️ Setup & Installation

Follow these steps to run the project locally.

### Prerequisites
*   **Node.js** (v18+ recommended)
*   **PostgreSQL** (installed and running)
*   **Google Cloud API Key** (for Gemini AI)
*   **Gmail Account** (for sending emails - App Password recommended)

### 1. specific Environment Variables
Create a `.env` file in the root directory and add the following:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
JWT_SECRET="your_super_secret_jwt_key"
GEMINI_API_KEY="your_google_gemini_api_key"
PORT=5000

# Email Configuration (Nodemailer)
SMTP_EMAIL="your_email@gmail.com"
SMTP_PASSWORD="your_app_password"
```

### 2. Install Dependencies

**Root (Backend):**
```bash
npm install
```

**Client (Frontend):**
```bash
cd client
npm install
cd ..
```

### 3. Database Setup
Initialize the database schema using Prisma:

```bash
npx prisma migrate dev --name init
```

### 4. Running the Application

You can start both the backend and frontend using the provided batch script (Windows):

```bash
start_app.bat
```

**Or manually:**

Terminal 1 (Backend):
```bash
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

## 📂 Project Structure

```
PROJECT/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context (AuthContext)
│   │   ├── pages/          # Page views (Dashboard, Login, History)
│   │   └── ...
│   └── public/             # Static assets (logo.png)
├── prisma/                 # Database Schema & Migrations
├── routes/                 # Express API Routes (auth, notes)
├── middleware/             # Auth middleware
├── utils/                  # Helper functions (emailSender, emailTemplates, pdfParser)
├── server.js               # Backend Entry Point
└── ...
```

## 🔗 API Endpoints

### Authentication
*   `POST /api/auth/register`: Create a new user (sends verification email).
*   `POST /api/auth/login`: Authenticate user and get token.
*   `POST /api/auth/verify-email`: Verify user email with token.
*   `POST /api/auth/forgot-password`: Request password reset link.
*   `POST /api/auth/reset-password`: Reset password with token.
*   `DELETE /api/auth/delete-account`: Delete user account (Protected).

### Notes
*   `POST /api/notes/analyze`: Upload PDF/Text for AI analysis. (Protected)
*   `GET /api/notes/history`: Fetch user's analysis history. (Protected)
