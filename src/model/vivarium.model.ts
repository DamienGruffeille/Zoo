import { Schema } from 'mongoose';
import { baseOption } from '../model/enclosure.model';
import Enclos from './enclosure.model';

const Vivarium = Enclos.discriminator(
    'Vivarium',
    new Schema(
        {
            temperature: { type: Number, required: true },
            humidity: { type: Number, required: true }
        },
        baseOption
    )
);

export default Vivarium;
