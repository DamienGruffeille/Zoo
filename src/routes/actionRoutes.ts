import express from 'express';
import controller from '../controllers/action.controller';
import validationMiddleware from '../middleware/validation.middleware';
import validate from '../validation/action.validation';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

router.post(
    '/creer',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    validationMiddleware(validate.register),
    controller.createAction
);

export = router;
