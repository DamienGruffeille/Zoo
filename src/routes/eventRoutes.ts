import express from 'express';
import controller from '../controllers/event.controller';
import validationMiddleware from '../middleware/validation.middleware';
import validate from '../validation/event.validation';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

router.post(
    '/creer',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    validationMiddleware(validate.register),
    controller.createEvent
);

router.get(
    '/get',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.getEvents
);

router.get(
    '/zones/:id',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.getEventsByZone
);

router.get(
    '/enclos/:id',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.getEventsByEnclosure
);

router.get(
    '/especes/last',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    validationMiddleware(validate.getLastEvent),
    controller.getLastEventBySpecie
);

router.get(
    '/especes/:id',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.getEventsBySpecie
);

router.get(
    '/animaux/:id',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.getEventsByAnimal
);

export = router;
