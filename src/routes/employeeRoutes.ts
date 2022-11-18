import express from 'express';
import controller from '../controllers/employee.controller';
import validationMiddleware from '../middleware/validation.middleware';
import validate from '../validation/employee.validation';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

router.post(
    '/create',
    extractJWT('Admin'),
    validationMiddleware(validate.register),
    controller.createEmployee
);
router.post('/login', controller.login);
router.get('/get/:employeeId', extractJWT('Admin'), controller.getEmployee);
router.get('/get', extractJWT('Admin'), controller.getAllEmployee);
router.put(
    '/update/:employeeId',
    extractJWT('Admin'),
    controller.updateEmployee
);
router.delete(
    '/delete/:employeeId',
    extractJWT('Admin'),
    controller.deleteEmployee
);

export = router;
