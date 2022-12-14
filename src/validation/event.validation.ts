import Joi from 'joi';

const register = Joi.object({
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

    animal: Joi.required(),

    eventType: Joi.string()
        .valid(
            'Entrée',
            'Sortie',
            'Nourrissage',
            'Soins',
            'Stimulation',
            'Naissance',
            'Décès',
            'Départ',
            'Arrivée',
            'Bagarre',
            'Accident',
            'Vérification'
        )
        .required(),

    observations: Joi.array().allow('').required()
});

const getLastEvent = Joi.object({
    _id: Joi.string().required(),
    eventType: Joi.string()
        .valid(
            'Entrée',
            'Sortie',
            'Nourrissage',
            'Soins',
            'Stimulation',
            'Naissance',
            'Décès',
            'Départ',
            'Arrivée',
            'Bagarre',
            'Accident',
            'Vérification'
        )
        .required()
});

export default { register, getLastEvent };
