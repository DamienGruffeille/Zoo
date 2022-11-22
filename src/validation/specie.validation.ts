import Joi from 'joi';

const register = Joi.object({
    _id: Joi.string().required(),

    name: Joi.string().required(),

    sociable: Joi.boolean().required(),

    observations: Joi.array(),

    dangerous: Joi.boolean().required(),

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
        .required()
});

const sortir = Joi.object({
    _id: Joi.string().required(),

    stillInsideAnimals: Joi.array().required()
});

const rentrer = Joi.object({
    _id: Joi.string().required(),

    stillOutsideAnimals: Joi.array().required()
});

const feed = Joi.object({
    _id: Joi.string().required()
});

const stimulate = Joi.object({
    _id: Joi.string().required()
});

export default { register, sortir, rentrer, feed, stimulate };
