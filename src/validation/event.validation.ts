import Joi from 'joi';

const register = Joi.object({
    createdBy: Joi.string().required(),

    enclosure: Joi.string().required(),

    specie: Joi.string().required(),

    animal: Joi.string().required(),

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

export default { register };
