import { Document } from 'mongoose';
import Enclosure from './enclosure.interface';

export default interface ISpecie extends Document {
    _id: string;
    name: string;
    sociable: boolean;
    observations: string[];
    dangerous: boolean;
    enclosure: Enclosure;
}
