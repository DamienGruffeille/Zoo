import { Schema, model } from 'mongoose';
import Specie from '../interface/specie.interface';

const baseOptions = { versionKey: false, timestamps: true };

/**
 * @openapi
 * components:
 *   schemas:
 *     SpecieSchema:
 *       type: object
 *       required:
 *         - _id
 *         - name
 *         - sociable
 *         - observations
 *         - dangerous
 *         - enclosure
 *       properties:
 *         _id:
 *           type: string
 *           default: kangourou
 *         name:
 *           type: string
 *           default: Kangourou
 *         sociable:
 *           type: boolean
 *           default: false
 *         observations:
 *           type: array
 *           default: []
 *         dangerous:
 *           type: boolean
 *           default: true
 *         enclosure:
 *           type: object
 *           default: desert-australie
 */
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

/**
 * @openapi
 * components:
 *   schemas:
 *     feedSpecieSchema:
 *       type: object
 *       required:
 *         - _id
 *       properties:
 *         _id:
 *           type: string
 *           default: kangourou
 */

export default model<Specie>('Species', SpecieSchema);
