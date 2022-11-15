import { model, Schema } from 'mongoose';
import EnclosureSchema from './enclosure.model';
import Vivarium from '../interface/vivarium.interface';

const VivariumSchema: Schema = new Schema({
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true }
});

const VivariumSignUp = EnclosureSchema.discriminator(
    'vivariums',
    VivariumSchema
);

// module.exports = { VivariumSignUp };
export default VivariumSignUp;
