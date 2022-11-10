import Joi from 'joi';

const register = Joi.object({
    name: Joi.string().max(30).required(),

    firstName: Joi.string().max(30).required(),

    email: Joi.string().email().required(),
    /** TODO : vérif de 6 caractères min ne fonctionne pas */
    password: Joi.string().min(6).required(),

    role: Joi.string()
        .valid('Soigneur', 'Responsable', 'Vétérinaire', 'Admin')
        .required()
});

const login = Joi.object({
    email: Joi.string().email().required(),

    password: Joi.string().required()
});

export default { register, login };
