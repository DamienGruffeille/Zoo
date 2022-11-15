import express from 'express';
import controller from '../controllers/enclosure.controller';
import validationMiddleware from '../middleware/validation.middleware';
import validate from '../validation/enclosure.validation';

const router = express.Router();

router.post(
    '/create',
    validationMiddleware(validate.register),
    controller.createEnclosure
);
router.get('/get/:enclosureId', controller.getEnclosure);
router.get('/get', controller.getAllEnclosure);
router.put('/update/:enclosureId', controller.updateEnclosure);
router.delete('/delete/:enclosureId', controller.deleteEnclosure);

export = router;
