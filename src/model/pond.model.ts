import { Schema } from 'mongoose';
import EnclosureSchema from './enclosure.model';

const PondSchema: Schema = new Schema({
    minTemperature: { type: Number, required: true },
    maxTemperature: { type: Number, required: true }
});

const PondSignUp = EnclosureSchema.discriminator('ponds', PondSchema);

module.exports = { PondSignUp };
