import Joi from 'joi';

const register = Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().required()
});

export default { register };
