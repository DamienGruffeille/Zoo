import express from 'express';
import controller from '../controllers/vivarium.controller';
import extractJWT from '../middleware/extractJWT';
import validationMiddleware from '../middleware/validation.middleware';
import validate from '../validation/vivarium.validation';

const router = express.Router();

router.post(
    '/create',
    extractJWT('Admin'),
    validationMiddleware(validate.register),
    controller.createVivarium
);
router.get(
    '/get/:vivariumId',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.getVivarium
);
router.get(
    '/get',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.getAllVivarium
);
router.put(
    '/update/:vivariumId',
    extractJWT('Admin'),
    controller.updateVivarium
);
router.delete(
    '/delete/:vivariumId',
    extractJWT('Admin'),
    controller.deleteVivarium
);

export = router;
