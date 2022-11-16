import Joi from 'joi';

const register = Joi.object({
    _id: Joi.string().required(),

    name: Joi.string().required(),

    specie: Joi.string()
        .valid(
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
        )
        .required(),

    birth: Joi.date().required(),

    death: Joi.date().allow(null, ''),

    sex: Joi.string().valid('F', 'M', 'Unknown').required(),

    observations: Joi.array(),

    position: Joi.string().valid('Dedans', 'Dehors', 'Infirmerie').required()
});

export default { register };
