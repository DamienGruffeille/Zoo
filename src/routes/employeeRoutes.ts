import express from 'express';
import controller from '../controllers/employee.controller';
import validationMiddleware from '../middleware/validation.middleware';
import validate from '../validation/employee.validation';

const router = express.Router();

router.post(
    '/create',
    validationMiddleware(validate.register),
    controller.createEmployee
);
router.get('/get/:employeeId', controller.getEmployee);
router.get('/get', controller.getAllEmployee);
router.put('/update/:employeeId', controller.updateEmployee);
router.delete('/delete/:employeeId', controller.deleteEmployee);

export = router;
