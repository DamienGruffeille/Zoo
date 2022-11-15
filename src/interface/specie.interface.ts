import { Document } from 'mongoose';

export default interface ISpecie extends Document {
    _id: string;
    name: string;
    sociable: boolean;
    observations: string[];
    dangerous: boolean;
    enclosure: object;
}
