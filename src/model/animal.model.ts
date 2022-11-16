import { Schema, model } from 'mongoose';
import Animal from '../interface/animal.interface';

const baseOptions = { versionKey: false, timestamps: true };

const AnimalSchema: Schema = new Schema(
    {
        _id: { type: String },
        name: { type: String, required: true },
        specie: {
            type: String,
            ref: 'species',
            enum: [
                'kangourou',
                'koala',
                'autruche',
                'tortue',
                'panda',
                'tigre',
                'orang-outan',
                'rhinoceros',
                'lama',
                'iguane',
                'boa',
                'ara',
                'dromadaire',
                'fennec',
                'vipere',
                'bison',
                'ours-noir',
                'loup',
                'aigle',
                'ours-polaire',
                'manchot',
                'phoque',
                'suricate',
                'gnou',
                'elephant',
                'lion',
                'girafe',
                'zebre',
                'vautour',
                'chamois',
                'lynx',
                'loutre',
                'marmotte',
                'chouette'
            ],
            required: true
        },
        birth: { type: Date, required: true },
        death: { type: Date, required: false },
        sex: {
            type: String,
            enum: ['F', 'M', 'Unknown'],
            required: true,
            default: 'Unknown'
        },
        observations: [String],
        position: {
            type: String,
            enum: ['Dedans', 'Dehors', 'Infirmerie'],
            required: true
        }
    },
    baseOptions
);

export default model<Animal>('Animals', AnimalSchema);
