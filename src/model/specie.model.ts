import { Schema, model } from 'mongoose';
import Specie from '../interface/specie.interface';

const baseOptions = { versionKey: false, timestamps: true };

const SpecieSchema: Schema = new Schema(
    {
        _id: { type: String },
        name: { type: String, required: true },
        sociable: { type: Boolean, required: true },
        observations: { type: Array },
        dangerous: { type: Boolean, required: true },
        enclosure: {
            type: String,
            ref: 'Enclosure',
            enum: [
                'desert-kangourous',
                'foret-koalas',
                'foret-pandas',
                'foret-tigres',
                'foret-orang-outans',
                'marais-rhinoceros',
                'montagne-lamas',
                'voliere-amerique-sud',
                'desert-dromadaires',
                'plaine-bisons',
                'foret-ours',
                'foret-loups',
                'voliere-aigles',
                'plaine-afrique',
                'plaine-lions',
                'plaine-suricates',
                'montagne-chamois',
                'voliere-europe',
                'montagne-lynx',
                'plaine-loutres',
                'vivarium-amerique-sud',
                'vivarium-afrique',
                'plage-tortues',
                'banquise-ours',
                'banquise-manchots',
                'banquise-phoques'
            ],
            required: true
        }
    },
    baseOptions
);

export default model<Specie>('Species', SpecieSchema);
