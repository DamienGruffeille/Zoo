import express from 'express';
import controller from '../controllers/species.controller';
import extractJWT from '../middleware/extractJWT';
import validationMiddleware from '../middleware/validation.middleware';
import validate from '../validation/specie.validation';

const router = express.Router();

router.post(
    '/create',
    extractJWT('Vétérinaire', 'Admin'),
    validationMiddleware(validate.register),
    controller.createSpecie
);
router.get(
    '/get/:specieId',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.getSpecie
);
router.get(
    '/get',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.getAllSpecies
);
router.put(
    '/update/:specieId',
    extractJWT('Responsable', 'Vétérinaire', 'Admin'),
    controller.updateSpecie
);
router.delete(
    '/delete/:specieId',
    extractJWT('Vétérinaire', 'Admin'),
    controller.deleteSpecie
);
router.put(
    '/sortir',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    validationMiddleware(validate.sortir),
    controller.takeSpecieOutside
);
router.put(
    '/rentrer',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    validationMiddleware(validate.rentrer),
    controller.takeSpecieInside
);
router.put(
    '/nourrir',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    validationMiddleware(validate.feed),
    controller.feedSpecie
);
router.put(
    '/stimuler',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    validationMiddleware(validate.stimulate),
    controller.stimulateSpecie
);

export = router;
