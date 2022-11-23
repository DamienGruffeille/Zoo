import { Schema, model } from 'mongoose';
import Action from '../interface/action.interface';

const baseOptions = { versionKey: false, timestamps: true };

const ActionSchema = new Schema(
    {
        createdBy: { type: String, ref: 'Employees', required: true },
        enclosure: { type: String, ref: 'Enclosure', required: true },
        specie: { type: String, ref: 'Specie', required: true },
        animal: { type: String, ref: 'Animal', required: true },
        plannedDate: { type: Date, min: Date.now(), required: true },
        status: {
            type: String,
            enum: ['Planifiée', 'Terminée'],
            default: 'Planifiée',
            required: true
        },
        observation: { type: String, required: true }
    },
    baseOptions
);

export default model<Action>('Actions', ActionSchema);
