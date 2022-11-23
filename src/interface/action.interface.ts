import { Date, Document } from 'mongoose';

export default interface IAction extends Document {
    createdBy: object;
    enclosure: object;
    specie: object;
    animal: object;
    plannedDate: Date;
    status: string;
    observation: string;
}
