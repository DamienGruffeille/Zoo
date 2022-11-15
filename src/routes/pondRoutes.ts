import express from 'express';
import controller from '../controllers/pond.controller';
import validationMiddleware from '../middleware/validation.middleware';
import validate from '../validation/pond.validation';

const router = express.Router();

router.post(
    '/create',
    validationMiddleware(validate.register),
    controller.createPond
);
router.get('/get/:pondId', controller.getPond);
router.get('/get', controller.getAllPond);
router.put('/update/:pondId', controller.updatePond);
router.delete('/delete/:pondId', controller.deletePond);

export = router;
