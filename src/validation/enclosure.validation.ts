import Joi from 'joi';

const register = Joi.object({
    _id: Joi.string().required(),

    name: Joi.string().required(),

    zone: Joi.string()
        .valid(
            'australie',
            'asie',
            'amerique-sud',
            'desert-afrique',
            'foret-amerique-nord',
            'pole-nord',
            'savane-afrique',
            'montagne-europe'
        )
        .required(),

    location: Joi.object().required(),

    surface_area: Joi.number().min(0).required()
});

const check = Joi.object({
    enclosure: Joi.string()
        .valid(
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
        )
        .required(),

    observations: Joi.array().required()
});

export default { register, check };
