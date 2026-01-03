// src/routes/admin-auth.route.js - NEW FILE FOR ADMIN DASHBOARD AUTH
import express from 'express';
import AuthController from '../controller/auth.controller';
import AuthMiddleWare from '../middleware/auth.middleware';

const router = express.Router();

// ===== ADMIN DASHBOARD AUTHENTICATION ROUTES =====
// These routes are specifically for the admin dashboard login

// @route   POST /api/v1/auth/admin/login
// @desc    Admin dashboard login (supports SUPER_ADMIN, ADMIN, EDITOR, VIEWER)
// @access  Public
router.post('/login', AuthController.adminLogin);

// @route   POST /api/v1/auth/admin/refresh
// @desc    Refresh admin access token
// @access  Public (requires valid refresh token)
router.post('/refresh', AuthController.refreshToken);

// @route   GET /api/v1/auth/admin/verify
// @desc    Verify admin token
// @access  Private
router.get('/verify', AuthMiddleWare.verifyToken, AuthController.getProfile);

// @route   GET /api/v1/auth/admin/me
// @desc    Get current admin profile
// @access  Private
router.get('/me', AuthMiddleWare.verifyToken, AuthController.getProfile);

// @route   POST /api/v1/auth/admin/logout
// @desc    Logout admin (optional - frontend handles token removal)
// @access  Private
router.post('/logout', AuthMiddleWare.verifyToken, (req, res) => {
  res.status(200).send({ 
    success: true, 
    message: 'Logged out successfully' 
  });
});

export default router;