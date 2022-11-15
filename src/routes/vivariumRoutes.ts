import express from 'express';
import controller from '../controllers/vivarium.controller';
import validationMiddleware from '../middleware/validation.middleware';
import validate from '../validation/vivarium.validation';

const router = express.Router();

router.post(
    '/create',
    validationMiddleware(validate.register),
    controller.createVivarium
);
router.get('/get/:vivariumId', controller.getVivarium);
router.get('/get', controller.getAllVivarium);
router.put('/update/:vivariumId', controller.updateVivarium);
router.delete('/delete/:vivariumId', controller.deleteVivarium);

export = router;
