import { Document } from 'mongoose';

export default interface IVivarium extends Document {
    _id: string;
    name: string;
    zone: object;
    location: object;
    surface_area: number;
    temperature: number;
    humidity: number;
}
