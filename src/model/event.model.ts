import { Schema, model } from 'mongoose';
import Event from '../interface/event.interface';

const baseOptions = { versionKey: false, timestamps: true };

const EventSchema = new Schema(
    {
        createdBy: { type: 'string', ref: 'Employees', required: true },
        enclosure: { type: 'string', ref: 'Enclosure', required: true },
        specie: { type: 'string', ref: 'Specie', required: true },
        animal: { type: 'string', ref: 'Animal', required: true },
        eventType: {
            type: 'string',
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
