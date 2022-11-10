import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Employee from '../model/Employee.model';

const createEmployee = (req: Request, res: Response, next: NextFunction) => {
    const { name, firstName, email, password, role } = req.body;

    const employee = new Employee({
        _id: new mongoose.Types.ObjectId(),
        name,
        firstName,
        email,
        password,
        role
    });

    return employee
        .save()
        .then((employee) => res.status(201).json({ employee }))
        .catch((error) => res.status(400).json({ error }));
};

const getEmployee = (req: Request, res: Response, next: NextFunction) => {
    const employeeId = req.params.employeeId;

    return Employee.findById(employeeId)
        .then((employee) =>
            employee
                ? res.status(200).json({ employee })
                : res.status(404).json({ message: 'Employee not found' })
        )
        .catch((error) => res.status(500).json({ error }));
};

const getAllEmployee = (req: Request, res: Response, next: NextFunction) => {
    return Employee.find()
        .then((employees) => res.status(200).json({ employees }))
        .catch((error) => res.status(500).json({ error }));
};

const updateEmployee = (req: Request, res: Response, next: NextFunction) => {
    const employeeId = req.params.employeeId;

    return Employee.findById(employeeId)
        .then((employee) => {
            if (employee) {
                employee.set(req.body);

                return employee
                    .save()
                    .then((employee) => res.status(201).json({ employee }))
                    .catch((error) => res.status(400).json({ error }));
            } else {
                res.status(404).json({ message: 'Employee not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

const deleteEmployee = (req: Request, res: Response, next: NextFunction) => {
    const employeeId = req.body.employeeId;

    return Employee.findByIdAndDelete(employeeId)
        .then((employee) =>
            employee
                ? res.status(201).json({ message: 'Employee deleted' })
                : res.status(404).json({ message: 'Employee not found' })
        )
        .catch((error) => res.status(500).json({ error }));
};

export default {
    createEmployee,
    getEmployee,
    getAllEmployee,
    updateEmployee,
    deleteEmployee
};
