import { Document } from 'mongoose';

export default interface IEvent extends Document {
    createdBy: object;
    enclosure: object;
    specie: object;
    animal: object[];
    eventType: string;
    observations: string[];
}
