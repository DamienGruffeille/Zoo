import { Document } from 'mongoose';

export default interface IAnimal extends Document {
    _id: string;
    name: string;
    specie: object;
    birth: Date;
    death: Date;
    sex: string;
    observations: string[];
    position: string;
}
