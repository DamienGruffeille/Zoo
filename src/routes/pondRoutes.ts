import express from 'express';
import controller from '../controllers/pond.controller';
import extractJWT from '../middleware/extractJWT';
import validationMiddleware from '../middleware/validation.middleware';
import validate from '../validation/pond.validation';

const router = express.Router();

router.post(
    '/create',
    extractJWT('Admin'),
    validationMiddleware(validate.register),
    controller.createPond
);
router.get(
    '/get/:pondId',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.getPond
);
router.get(
    '/get',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.getAllPond
);
router.put('/update/:pondId', extractJWT('Admin'), controller.updatePond);
router.delete('/delete/:pondId', extractJWT('Admin'), controller.deletePond);

export = router;
