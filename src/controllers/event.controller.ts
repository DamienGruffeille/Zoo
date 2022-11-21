import { Request, Response, NextFunction } from 'express';
import Logging from '../library/logging';
import Event from '../model/event.model';

const NAMESPACE = 'Event';

const createEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { createdBy, enclosure, specie, animal, eventType, observations } =
        req.body;

    const event = new Event({
        createdBy,
        enclosure,
        specie,
        animal,
        eventType,
        observations
    });
    try {
        const createdEvent = await event.save();
        return res
            .status(201)
            .json({ message: 'Evènement créé : ', createdEvent });
    } catch (error) {
        res.status(400).json({ message: 'Evènement non créé', error });
        Logging.error(NAMESPACE, error);
    }
};

export default { createEvent };
