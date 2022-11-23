import { Schema, model } from 'mongoose';
import Event from '../interface/event.interface';

const baseOptions = { versionKey: false, timestamps: true };

const EventSchema = new Schema(
    {
        createdBy: { type: String, ref: 'Employees', required: true },
        enclosure: { type: String, ref: 'Enclosure', required: true },
        specie: { type: String, ref: 'Specie', required: true },
        animal: { type: Array, ref: 'Animal', required: true },
        eventType: {
            type: String,
            enum: [
                'Entrée',
                'Sortie',
                'Nourrissage',
                'Soins',
                'Stimulation',
                'Naissance',
                'Décès',
                'Départ',
                'Arrivée',
                'Bagarre',
                'Accident',
                'Vérification'
            ],
            required: true
        },
        observations: { type: Array }
    },
    baseOptions
);

export default model<Event>('Events', EventSchema);
