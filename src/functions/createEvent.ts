import IEvent from '../interface/event.interface';
import Logging from '../library/logging';
import Event from '../model/event.model';

const NAMESPACE = 'Event';

export const createEvent = async (
    createdBy: string,
    enclosure: string,
    specie: object,
    animal: string,
    eventType: string,
    observations: string
) => {
    const event: IEvent = new Event({
        createdBy,
        enclosure,
        specie,
        animal,
        eventType,
        observations
    });

    try {
        const createdEvent = await event.save();
        return createdEvent;
    } catch (error) {
        Logging.error(NAMESPACE, error);
    }
};
