# LCC Portal Backend

The backend API for the LCC Portal, serving as the core logic for member management, service scheduling, media integration, and communications.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **External APIs**: YouTube Data API, WhatsApp/SMS Services
- **Infrastructure**: Google Cloud Run (Production), Render (Development)
- **Containerization**: Docker

## 📂 Project Structure

```
lcc-backend/
├── src/
│   ├── controller/      # Request handlers
│   ├── models/          # Database models
│   ├── routes/          # API route definitions
│   ├── service/         # Business logic & external integrations
│   └── app.js           # App entry point
├── .gitlab-ci.yml       # CI/CD Pipeline configuration
├── Dockerfile           # Docker image definition
└── package.json         # Dependencies
```

## 🔌 API Modules

The API exposes the following main modules:

- **Auth**: User authentication and authorization.
- **Members**: Member profile management.
- **Services**: Church service scheduling and management.
- **Programs**: Special program events.
- **Testimonies**: Member testimony submissions.
- **First Timers**: Tracking and management of first-time visitors.
- **Celebrants**: Managing birthday/anniversary celebrants.
- **Follow Up**: Follow-up tracking for members/visitors.
- **Hero Slides**: Management of homepage banner slides.

## 🛠️ Local Development Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Docker (optional, for containerized testing)

### 1. Clone & Install
```bash
git clone <repository-url>
cd lcc-backend
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# Application
PORT=8080
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/lcc_db

# Security
JWT_SECRET=your_super_secret_key

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# External Services (Optional for local dev)
YOUTUBE_API_KEY=your_youtube_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

### 3. Run Locally
```bash
# Development mode (with hot reload if configured)
npm run dev

# Production mode
npm start
```

## 🐳 Docker Support

Build and run the application using Docker:

```bash
# Build the image
docker build -t lcc-backend .

# Run the container
docker run -p 8080:8080 --env-file .env lcc-backend
```

## 🚀 Deployment & CI/CD

This project uses a **Simplified 2-Stage Pipeline**:

1.  **Development (`deploy-dev`)**:
    - Automatically deploys to **Render** on push to `develop`.
    - No infrastructure provisioning required.

2.  **Production (`deploy-prod`)**:
    - Manually triggered on `staging` or `main`.
    - **All-in-One Job**: Plans infrastructure, provisions GCP resources (Cloud Run, Secrets), builds Docker image, and deploys.
    - **Cost Control**: Includes `suspend-prod` and `resume-prod` jobs to pause costs when not in use.

> **Note**: For detailed deployment instructions, infrastructure setup, and pipeline architecture, please refer to the documentation in the **`lcc-infrastructure`** repository.

### Quick Links (Infrastructure Repo)
- [Deployment Guide](../lcc-infrastructure/lcc-backend/DEPLOYMENT.md)
- [Setup Checklist](../lcc-infrastructure/lcc-backend/SETUP_CHECKLIST.md)
- [Pipeline Simplified](../lcc-infrastructure/lcc-backend/PIPELINE_SIMPLIFIED.md)

## 🤝 Contributing

1.  Create a feature branch (`git checkout -b feature/amazing-feature`).
2.  Commit your changes (`git commit -m 'Add amazing feature'`).
3.  Push to the branch (`git push origin feature/amazing-feature`).
4.  Open a Merge Request.
