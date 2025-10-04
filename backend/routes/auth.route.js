import express from 'express';
import { signup, login, logout } from '../controllers/auth.controller.js';

const router = express.Router();

router.get("/signup", signup);  // If user clicks the signup button, call the signup function.
router.get("/login", login);    // If user clicks the login button, call the login function.
router.get("/Logout", logout);  // If user clicks the logout button, call the logout function.

export default router;