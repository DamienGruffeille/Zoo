import express from 'express';
import controller from '../controllers/employee.controller';
import validationMiddleware from '../middleware/validation.middleware';
import validate from '../validation/employee.validation';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

router.post(
    '/create',
    validationMiddleware(validate.register),
    controller.createEmployee
);
router.post('/login', controller.login);
router.get('/get/:employeeId', extractJWT, controller.getEmployee);
router.get('/get', controller.getAllEmployee);
router.put('/update/:employeeId', controller.updateEmployee);
router.delete('/delete/:employeeId', controller.deleteEmployee);

export = router;
