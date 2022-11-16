import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Employee from '../model/Employee.model';
import Logging from '../library/logging';

const NAMESPACE = 'Employee';

const createEmployee = (req: Request, res: Response, next: NextFunction) => {
    const { name, firstName, email, password, role, zone } = req.body;

    const employee = new Employee({
        _id: new mongoose.Types.ObjectId(),
        name,
        firstName,
        email,
        password,
        role,
        zone
    });

    return employee
        .save()
        .then((employee) =>
            res.status(201).json({ message: 'Employé(e) créé(e)', employee })
        )
        .catch((error) => {
            res.status(400).json({ error });
            Logging.error(NAMESPACE, error);
        });
};

const getEmployee = (req: Request, res: Response, next: NextFunction) => {
    const employeeId = req.params.employeeId;

    return Employee.findById(employeeId)
        .populate('zone')
        .then((employee) =>
            employee
                ? res
                      .status(200)
                      .json({ message: 'Employé(e) trouvé(e)', employee })
                : res.status(404).json({ message: 'Employee not found' })
        )
        .catch((error) => {
            res.status(500).json({ error });
            Logging.error(NAMESPACE, error);
        });
};

const getAllEmployee = (req: Request, res: Response, next: NextFunction) => {
    return Employee.find()
        .then((employees) =>
            res
                .status(200)
                .json({ message: 'Liste des Employé(e)s', employees })
        )
        .catch((error) => {
            res.status(500).json({ error });
            Logging.error(NAMESPACE, error);
        });
};

const updateEmployee = (req: Request, res: Response, next: NextFunction) => {
    const employeeId = req.params.employeeId;

    return Employee.findById(employeeId)
        .then((employee) => {
            if (employee) {
                employee.set(req.body);

                return employee
                    .save()
                    .then((employee) =>
                        res.status(200).json({
                            message: 'Employé(e) mis(e) à jour',
                            employee
                        })
                    )
                    .catch((error) => {
                        res.status(400).json({ error });
                        Logging.error(NAMESPACE, error);
                    });
            } else {
                res.status(404).json({ message: 'Employee not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
            Logging.error(NAMESPACE, error);
        });
};

const deleteEmployee = (req: Request, res: Response, next: NextFunction) => {
    const employeeId = req.params.employeeId;

    return Employee.findByIdAndDelete(employeeId)
        .then((employee) =>
            employee
                ? res
                      .status(200)
                      .json({ message: 'Employee deleted', employee })
                : res.status(404).json({ message: 'Employee not found' })
        )
        .catch((error) => {
            res.status(500).json({ error });
            Logging.error(NAMESPACE, error);
        });
};

export default {
    createEmployee,
    getEmployee,
    getAllEmployee,
    updateEmployee,
    deleteEmployee
};
