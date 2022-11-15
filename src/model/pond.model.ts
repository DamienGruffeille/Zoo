import { Schema } from 'mongoose';
import { baseOption } from './enclosure.model';
import Enclos from './enclosure.model';

const Pond = Enclos.discriminator(
    'Bassin',
    new Schema(
        {
            minTemperature: { type: Number, required: true },
            maxTemperature: { type: Number, required: true }
        },
        baseOption
    )
);

export default Pond;
