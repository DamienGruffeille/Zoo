import { model, Schema } from 'mongoose';
import Zone from '../interface/zone.interface';

const ZoneSchema: Schema = new Schema(
    {
        _id: { type: String },
        name: { type: String, required: true }
    },
    { versionKey: false, timestamps: true }
);

export default model<Zone>('Zone', ZoneSchema);
