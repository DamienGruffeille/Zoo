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

    surface_area: Joi.number().min(0).required(),

    temperature: Joi.number().required(),

    humidity: Joi.number().min(0).max(100).required()
});

export default { register };
