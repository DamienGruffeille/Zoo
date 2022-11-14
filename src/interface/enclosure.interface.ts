import { Document } from 'mongoose';

export default interface IEnclosure extends Document {
    _id: string;
    name: string;
    zone: object;
    location: object;
    surface_area: number;
}
