import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Zone from '../model/zone.model';

const createZone = (req: Request, res: Response, next: NextFunction) => {
    const { _id, name } = req.body;

    const zone = new Zone({
        _id,
        name
    });

    return zone
        .save()
        .then((zone) => res.status(201).json({ message: 'Zone créée', zone }))
        .catch((error) => res.status(400).json({ error }));
};

export default { createZone };
