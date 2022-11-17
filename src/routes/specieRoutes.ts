import express from 'express';
import controller from '../controllers/species.controller';
import validationMiddleware from '../middleware/validation.middleware';
import validate from '../validation/specie.validation';

const router = express.Router();

router.post(
    '/create',
    validationMiddleware(validate.register),
    controller.createSpecie
);
router.get('/get/:specieId', controller.getSpecie);
router.get('/get', controller.getAllSpecies);
router.put('/update/:specieId', controller.updateSpecie);
router.delete('/delete/:specieId', controller.deleteSpecie);
router.put('/sortir', controller.takeSpecieOutside);
router.put('/rentrer', controller.takeSpecieInside);
router.put('/nourrir', controller.feedSpecie);
router.put('/stimuler', controller.stimulateSpecie);

export = router;
