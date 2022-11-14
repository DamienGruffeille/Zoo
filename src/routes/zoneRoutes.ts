import express from 'express';
import controller from '../controllers/zone.controller';
import validationMiddleware from '../middleware/validation.middleware';
import validate from '../validation/zone.validation';

const router = express.Router();

router.post(
    '/create',
    validationMiddleware(validate.register),
    controller.createZone
);

export = router;
