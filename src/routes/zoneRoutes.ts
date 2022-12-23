import express from 'express';
import controller from '../controllers/zone.controller';
import extractJWT from '../middleware/extractJWT';
import validationMiddleware from '../middleware/validation.middleware';
import validate from '../validation/zone.validation';

const router = express.Router();

router.post(
    '/create',
    extractJWT('Admin'),
    validationMiddleware(validate.register),
    controller.createZone
);

router.get(
    '/get/:zone',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.getZones
);

export = router;
