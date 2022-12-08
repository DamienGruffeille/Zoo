import express from 'express';
import controller from '../controllers/enclosure.controller';
import extractJWT from '../middleware/extractJWT';
import validationMiddleware from '../middleware/validation.middleware';
import validate from '../validation/enclosure.validation';

const router = express.Router();

router.post(
    '/create',
    extractJWT('Admin'),
    validationMiddleware(validate.register),
    controller.createEnclosure
);

router.post(
    '/verifier',
    extractJWT('Responsable', 'Vétérinaire'),
    validationMiddleware(validate.check),
    controller.checkEnclosure
);

router.get(
    '/get/:enclosureId',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.getEnclosure
);

router.get(
    '/get',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.getAllEnclosure
);

router.get(
    '/get/zone/:zoneId',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.getEnclosuresByZone
);

router.put(
    '/update/:enclosureId',
    extractJWT('Admin'),
    controller.updateEnclosure
);

router.delete(
    '/delete/:enclosureId',
    extractJWT('Admin'),
    controller.deleteEnclosure
);

export = router;
