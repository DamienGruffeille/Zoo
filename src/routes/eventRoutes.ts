import express from 'express';
import controller from '../controllers/event.controller';
import validationMiddleware from '../middleware/validation.middleware';
import validate from '../validation/event.validation';

const router = express.Router();

router.post(
    '/creer',
    validationMiddleware(validate.register),
    controller.createEvent
);

export = router;
