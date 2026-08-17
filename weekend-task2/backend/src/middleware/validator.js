import { body, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const signupValidation = [
  body('name').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/)
    .withMessage('Password must be at least 8 chars, include 1 uppercase & 1 special symbol'),
  validate 
];

export const loginValidation = [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/)
    .withMessage('Password must be at least 8 chars, include 1 uppercase & 1 special symbol'),
  validate
];