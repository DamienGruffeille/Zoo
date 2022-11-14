import { model, Schema } from 'mongoose';
import Enclosure from '../interface/enclosure.interface';

const EnclosureSchema: Schema = new Schema(
    {
        _id: { type: String },
        name: { type: String, required: true },
        zone: {
            type: String,
            ref: 'Zone',
            enum: [
                'australie',
                'asie',
                'amerique-sud',
                'desert-afrique',
                'foret-amerique-nord',
                'pole-nord',
                'savane-afrique',
                'montagne-europe',
                'toutes'
            ],
            required: true
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },
        surface_area: { type: Number, required: true }
    },
    { versionKey: false, timestamps: true }
);

export default model<Enclosure>('Enclosure', EnclosureSchema);
