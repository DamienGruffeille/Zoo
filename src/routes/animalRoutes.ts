import express from 'express';
import controller from '../controllers/animal.controller';
import validationMiddleware from '../middleware/validation.middleware';
import validate from '../validation/animal.validation';

const router = express.Router();

router.post(
    '/create',
    validationMiddleware(validate.register),
    controller.createAnimal
);
router.get('/get/:animalId', controller.getAnimal);
router.get('/get', controller.getAllAnimals);
router.put('/update/:animalId', controller.updateAnimal);
router.delete('/delete/:animalId', controller.deleteAnimal);

export = router;
