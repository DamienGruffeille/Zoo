import { Document, ObjectId } from 'mongoose';

export default interface IZone extends Document {
    _id: string;
    name: string;
}
