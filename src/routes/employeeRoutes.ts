import express from 'express';
import controller from '../controllers/employee.controller';
import validationMiddleware from '../middleware/validation.middleware';
import validate from '../validation/employee.validation';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

/**
 * @openapi
 * '/api/employes/create':
 *  post:
 *     tags:
 *     - Employes
 *     summary: Register a new employee
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/EmployeeSchema'
 *     responses:
 *      201:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EmployeeSchema'
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 */
router.post(
    '/create',
    extractJWT('Admin'),
    validationMiddleware(validate.register),
    controller.createEmployee
);
/**
 * @openapi
 * '/api/employes/login':
 *  post:
 *     tags:
 *     - Employes
 *     summary: Employee login
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/EmployeeLoginSchema'
 *     responses:
 *      200:
 *        description: Authentificated Successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EmployeeLoginSchema'
 *      401:
 *        description: Authentification failed
 *      404:
 *        description: Employee unkown
 */
router.post('/login', controller.login);
/**
 * @openapi
 * '/api/employes/get/{employeeId}':
 *  get:
 *     tags:
 *     - Employes
 *     summary: get an Employee
 *     security:
 *       - bearerAuth: [admin]
 *     parameters:
 *     - in: path
 *       name: employeeId
 *       required: true
 *       schema:
 *         type: string
 *       description: The Employee ID
 *     responses:
 *      200:
 *        description: Employee found
 *        content:
 *          application/json:
 *              $ref: '#/components/schemas/EmployeeSchema'
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Employee unkown
 *      500:
 *        description: Error occurred
 */
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
