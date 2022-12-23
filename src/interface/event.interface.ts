import { Document } from 'mongoose';
import Enclosure from '../interface/enclosure.interface';

export default interface IEvent extends Document {
    createdBy: object;
    enclosure: Enclosure;
    specie: object;
    animal: object[];
    eventType: string;
    observations: string[];
}
