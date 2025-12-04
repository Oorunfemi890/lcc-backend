// src/index.js 
import "core-js/stable";
import "regenerator-runtime/runtime";
require("dotenv").config();

// Force IPv4 DNS resolution
const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const http = require('http');
const path = require('path');

// Import existing configurations
const db = require("../models");
const { stream, logger } = require("./logger/winston");
const customExpress = require("./validation/express.validation");

// Import existing routes (from your brother's work)
import authRoute from "./routes/auth.route";
import member from './routes/member.route';
import celebrant from './routes/celebrant.route';
import firsttimer from './routes/first-timer.route';
import followup from './routes/follow-up.route';
import program from './routes/program.route';
import service from './routes/service.route';
import testimony from './routes/testimony.route';
import heroslide from './routes/hero-slide.route';

// Import admin dashboard routes (your copied routes)
const adminAuthRoutes = require("./routes/adminsDashboardRoutes/authRoute");
const adminRoutes = require("./routes/adminsDashboardRoutes/adminRoute");
const membersRoutes = require("./routes/adminsDashboardRoutes/membersRoute");
const attendanceRoutes = require("./routes/adminsDashboardRoutes/attendanceRoute");
const eventsRoutes = require("./routes/adminsDashboardRoutes/eventsRoute");
const celebrationsRoutes = require("./routes/adminsDashboardRoutes/celebrationsRoute");
const dashboardRoutes = require("./routes/adminsDashboardRoutes/dashboardRoute");

const app = express();
const server = http.createServer(app);

// ===================================
// MIDDLEWARE CONFIGURATION
// ===================================

// Enhanced CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigins = [
      process.env.CLIENT_URL,
      process.env.ADMIN_URL,
      'https://rccg-center.netlify.app',
      'https://rccg-centre-admin-dashboard.netlify.app',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
    ];

    // Check exact match or Netlify preview
    if (allowedOrigins.includes(origin) || origin.includes('netlify.app')) {
      logger.info(`CORS allowed for origin: ${origin}`);
      return callback(null, true);
    }

    // In production, be lenient to avoid blocking legitimate requests
    if (process.env.NODE_ENV === 'production') {
      logger.warn(`CORS warning for origin: ${origin} - allowing anyway`);
      return callback(null, true);
    }

    logger.error(`CORS blocked origin: ${origin}`);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin"
  ],
  exposedHeaders: ["Content-Length", "X-Request-Id"],
  maxAge: 86400,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// Logging
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined", { 
    stream: stream,
    skip: (req) => req.path === '/health'
  }));
}

// Set view engine for email templates
app.set('view engine', 'ejs');

// Static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ===================================
// DATABASE MIDDLEWARE (CRITICAL FIX)
// ===================================

// Middleware to inject database models into every request
const ensureDatabase = (req, res, next) => {
  try {
    if (!db || !db.sequelize) {
      logger.error('Database not initialized');
      return res.status(503).json({
        success: false,
        message: 'Database connection unavailable',
        code: 'DB_NOT_INITIALIZED'
      });
    }

    // ✅ INJECT ALL MODELS INTO REQUEST for admin dashboard controllers
    req.db = {
      sequelize: db.sequelize,
      Sequelize: db.Sequelize,
      // Original models
      Member: db.Member,
      AdminUser: db.AdminUser,
      Celebrant: db.Celebrant,
      FirstTimer: db.FirstTimer,
      FollowUp: db.FollowUp,
      Program: db.Program,
      Service: db.Service,
      Testimony: db.Testimony,
      // Alias for admin dashboard compatibility
      Admin: db.AdminUser, // ✅ AdminUser is the actual model name
      Celebration: db.Celebrant, // ✅ Celebrant is the actual model name
      // Note: Attendance, Event, MemberAttendance models need to be created
    };

    next();
  } catch (error) {
    logger.error('Database middleware error:', error);
    return res.status(503).json({
      success: false,
      message: 'Database connection error',
      code: 'DB_ERROR'
    });
  }
};

// Apply custom express validation
app.response = Object.create(customExpress);

// ===================================
// HEALTH CHECK ENDPOINTS
// ===================================

app.get("/health-check", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    database: db ? "Connected" : "Not initialized"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString()
  });
});

// ===================================
// EXISTING ROUTES (Main Church Site)
// ===================================

app.use("/api/v1/auth", ensureDatabase, authRoute);
app.use("/api/v1/member", ensureDatabase, member);
app.use("/api/v1/celebrant", ensureDatabase, celebrant);
app.use("/api/v1/firsttimer", ensureDatabase, firsttimer);
app.use("/api/v1/followup", ensureDatabase, followup);
app.use("/api/v1/program", ensureDatabase, program);
app.use("/api/v1/service", ensureDatabase, service);
app.use("/api/v1/testimony", ensureDatabase, testimony);
app.use("/api/v1/hero-slider", ensureDatabase, heroslide);

// ===================================
// ADMIN DASHBOARD ROUTES (New)
// ===================================

// Admin authentication routes
app.use("/api/admin/auth", ensureDatabase, adminAuthRoutes);

// Admin management routes
app.use("/api/admin/admins", ensureDatabase, adminRoutes);
app.use("/api/admin/members", ensureDatabase, membersRoutes);
app.use("/api/admin/attendance", ensureDatabase, attendanceRoutes);
app.use("/api/admin/events", ensureDatabase, eventsRoutes);
app.use("/api/admin/celebrations", ensureDatabase, celebrationsRoutes);
app.use("/api/admin/dashboard", ensureDatabase, dashboardRoutes);

// ===================================
// ERROR HANDLING
// ===================================

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use(function (err, req, res, next) {
  logger.error(
    err.response
      ? [err.response.data.toString().split("\n")[0], req.originalUrl].join()
      : err.stack
        ? [err.toString().split("\n")[0], req.originalUrl].join()
        : [err.toString().split("\n")[0], req.originalUrl].join()
  );

  res.status(err?.response?.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? "Internal Server Error" 
      : err.message,
    description: `Something broke!. Check application logs. OriginalUrl: ${req.originalUrl}`,
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// ===================================
// DATABASE CONNECTION & SERVER START
// ===================================

const PORT = process.env.PORT || 3000;

(async function startServer() {
  try {
    // Test database connection
    await db.sequelize.authenticate();
    logger.info("✅ Database connection established successfully!");
    
    // Log available models
    const models = Object.keys(db).filter(
      key => key !== 'sequelize' && key !== 'Sequelize'
    );
    logger.info(`✅ Available models: ${models.join(', ')}`);

    // Start server
    server.listen(PORT, '0.0.0.0', () => {
      logger.info('🎉 ========================================');
      logger.info('🎉 LCC Backend Server Started Successfully');
      logger.info('🎉 ========================================');
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🗄️  Database: Connected`);
      logger.info(`🔗 Health check: /health-check`);
      logger.info(`📡 CORS enabled for: ${process.env.CLIENT_URL}, ${process.env.ADMIN_URL}`);
      logger.info('========================================');
    });

  } catch (error) {
    logger.error("❌ Unable to connect to the database:", error);
    logger.error("Server startup failed. Exiting...");
    process.exit(1);
  }
})();

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received, shutting down gracefully...`);
  
  server.close(async () => {
    try {
      if (db && db.sequelize) {
        await db.sequelize.close();
        logger.info("✅ Database connection closed.");
      }
      process.exit(0);
    } catch (error) {
      logger.error("❌ Error during shutdown:", error);
      process.exit(1);
    }
  });

  setTimeout(() => {
    logger.error("❌ Could not close connections in time, forcefully shutting down");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

export default server;