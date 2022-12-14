import express from 'express';
import controller from '../controllers/animal.controller';
import validationMiddleware from '../middleware/validation.middleware';
import validate from '../validation/animal.validation';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

router.post(
    '/create',
    extractJWT('Vétérinaire', 'Admin'),
    validationMiddleware(validate.register),
    controller.createAnimal
);

router.post(
    '/soigner',
    extractJWT('Vétérinaire'),
    validationMiddleware(validate.heal),
    controller.healAnimal
);

router.get(
    '/get/:animalId',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.getAnimal
);

router.get(
    '/get/specie/:specieId',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.getAnimalsBySpecie
);

router.get(
    '/get',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.getAllAnimals
);

router.put(
    '/update/:animalId',
    extractJWT('Responsable', 'Vétérinaire', 'Admin'),
    controller.updateAnimal
);

router.delete(
    '/delete/:animalId',
    extractJWT('Vétérinaire', 'Admin'),
    controller.deleteAnimal
);

router.put(
    '/sortir',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    validationMiddleware(validate.movement),
    controller.takeAnimalOutside
);

router.put(
    '/rentrer',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    validationMiddleware(validate.movement),
    controller.takeAnimalInside
);

export = router;
