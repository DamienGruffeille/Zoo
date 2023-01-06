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

router.get(
    '/toutes',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.getAllActions
);

router.get(
    '/employe/:employeeName',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.getActionsByEmployee
);

router.get(
    '/zones/:id',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.getActionsByZone
);

router.get(
    '/enclos/:id',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.getActionsByEnclosure
);

router.get(
    '/especes/:id',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.getActionsBySpecie
);

router.get(
    '/animaux/:id',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.getActionsByAnimal
);

router.get(
    `/next/:employeeId`,
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.getNextAction
);

router.put(
    `/update`,
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.updateAction
);

export = router;
