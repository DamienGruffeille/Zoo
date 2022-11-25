import { Request, Response, NextFunction } from 'express';
import { Error } from 'mongoose';
import { createEvent } from '../functions/createEvent';
import Logging from '../library/logging';
import Animal from '../model/animal.model';
import Specie from '../interface/specie.interface';
import { getUserName } from '../functions/getUserName';
import { isZoneAuthorized } from '../functions/isZoneAuthorized';

const NAMESPACE = 'Animal';

const createAnimal = (req: Request, res: Response, next: NextFunction) => {
    const { _id, name, specie, birth, death, sex, observations, position } =
        req.body;

    const animal = new Animal({
        _id,
        name,
        specie,
        birth,
        death,
        sex,
        observations,
        position
    });

    return animal
        .save()
        .then((animal) =>
            res.status(201).json({ message: 'Animal créé', animal })
        )
        .catch((error) => {
            res.status(500).json({ message: 'Animal non créé', error });
            Logging.error(NAMESPACE, error);
        });
};

const getAnimal = (req: Request, res: Response, next: NextFunction) => {
    const animalId = req.params.animalId;

    return (
        Animal.findById(animalId)
            // .populate('species')
            .then((animal) =>
                animal
                    ? res.status(200).json({ message: 'Animal trouvé', animal })
                    : res.status(404).json({ message: 'Animal non trouvé' })
            )
            .catch((error) => {
                res.status(500).json({ error });
                Logging.error(NAMESPACE, error);
            })
    );
};

const getAllAnimals = (req: Request, res: Response, next: NextFunction) => {
    return Animal.find()
        .then((animals) =>
            res.status(200).json({ message: 'Liste des animaux', animals })
        )
        .catch((error) => {
            res.status(500).json({ error });
            Logging.error(NAMESPACE, error);
        });
};

const updateAnimal = (req: Request, res: Response, next: NextFunction) => {
    const animalId = req.params.animalId;

    return Animal.findById(animalId)
        .then((animal) => {
            if (animal) {
                animal.set(req.body);
                return animal
                    .save()
                    .then((animal) =>
                        res
                            .status(200)
                            .json({ message: 'Animal mis à jour', animal })
                    )
                    .catch((error) => {
                        res.status(404).json({ error });
                        Logging.error(NAMESPACE, error);
                    });
            } else {
                res.status(404).json({ message: 'Animal non trouvé' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
            Logging.error(NAMESPACE, error);
        });
};

const deleteAnimal = (req: Request, res: Response, next: NextFunction) => {
    const animalId = req.params.animalId;

    return Animal.findByIdAndDelete(animalId)
        .then((animal) =>
            animal
                ? res.status(200).json({ message: 'Animal supprimé', animal })
                : res.status(404).json({ message: 'Animal non trouvé' })
        )
        .catch((error) => {
            res.status(500).json({ error });
            Logging.error(NAMESPACE, error);
        });
};

const takeAnimalOutside = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const animalId: string = req.body._id;
    const animalPosition = await Animal.findById(animalId)
        .select('position')
        .exec();

    Logging.info(NAMESPACE, 'Animal position = ' + animalPosition);

    /** Vérification si l'animal n'est pas déjà dehors */
    if (animalPosition?.position === 'Dehors') {
        return res.status(400).json({ message: "L'animal est déjà dehors" });
    }

    if (!req.headers.authorization) {
        return res
            .status(500)
            .json({ message: 'Headers.authorization manquant' });
    }
    Logging.info(NAMESPACE, 'Le header a bien été envoyé');

    try {
        /** L'animal n'est pas dehors donc je le cherche par son ID puis update sa position */
        const animalUpdated = await Animal.findOneAndUpdate(
            { _id: animalId },
            { position: 'Dehors' }
        )
            .orFail()
            .populate('specie')
            .exec();

        const specie: any = animalUpdated.specie;
        let animalArray = [animalUpdated._id];

        /** Vérification de la présence du headers authorization pour récupérer le nom de l'employé(é) */

        /** Appel de la fonction qui permet d'extraire le nom de l'employé pour créer l'évènement */
        getUserName(req.headers.authorization, async (error, username) => {
            if (error) {
                Logging.error(
                    NAMESPACE,
                    'Impossible de récupérer le username ' + error
                );

                return res.status(401).json({
                    message: 'Username non récupéré',
                    error: error
                });
            } else if (username) {
                /**  On a bien le nom de l'employé(e), appel de la fonction de vérification des droits sur la zone de l'enclos */
                if (await isZoneAuthorized(username, specie.enclosure)) {
                    /** L'employé(e) est bien habilité(e) donc on créé l'évènement */
                    const newEvent = await createEvent(
                        username,
                        specie.enclosure,
                        specie,
                        animalArray,
                        'Sortie',
                        ''
                    );
                    Logging.info(
                        NAMESPACE,
                        animalUpdated.name + ' est sorti par ' + username
                    );
                    return res.status(202).json({
                        message: 'Animal sorti : ' + animalUpdated.name,
                        newEvent
                    });
                } else {
                    /** L'employé(e) n'est pas habilité sur la zone */
                    return res.status(404).json({
                        message: 'Soigneur non habilité pour cette zone'
                    });
                }
            }
        });
    } catch (error) {
        if (error instanceof Error.DocumentNotFoundError) {
            Logging.error(NAMESPACE, error);
            res.status(404).json({ error });
        } else {
            Logging.error(NAMESPACE, error);
            res.status(500).json({ error });
        }
    }
};

const takeAnimalInside = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const animalId = req.body._id;
    const animalPosition = await Animal.findById(animalId)
        .select('position')
        .exec();

    /** Vérification si l'animal n'est pas déjà dedans */
    if (animalPosition?.position === 'Dedans') {
        res.status(400).json({ message: "L'animal est déjà à l'intérieur" });
    } else {
        try {
            /** L'animal n'est pas dedans donc je le cherche par son ID puis update sa position */
            const animalUpdated = await Animal.findOneAndUpdate(
                { _id: animalId },
                { position: 'Dedans' }
            )
                .orFail()
                .populate('specie')
                .exec();

            const specie: any = animalUpdated.specie;
            let animalArray = [animalUpdated._id];

            /** Vérification de la présence du headers authorization pour récupérer le nom de l'employé(é) */
            if (req.headers.authorization) {
                Logging.info(NAMESPACE, 'Le header a bien été envoyé');

                /** Appel de la fonction qui permet d'extraire le nom de l'employé pour créer l'évènement */
                getUserName(
                    req.headers.authorization,
                    async (error, username) => {
                        if (error) {
                            Logging.error(
                                NAMESPACE,
                                'Impossible de récupérer le username ' + error
                            );

                            return res.status(401).json({
                                message: 'Username non récupéré',
                                error: error
                            });
                        } else if (username) {
                            /**  On a bien le nom de l'employé(e), appel de la fonction de vérification des droits sur la zone de l'enclos */
                            if (
                                await isZoneAuthorized(
                                    username,
                                    specie.enclosure
                                )
                            ) {
                                const newEvent = await createEvent(
                                    username,
                                    specie.enclosure,
                                    specie,
                                    animalArray,
                                    'Entrée',
                                    ''
                                );
                                Logging.info(
                                    NAMESPACE,
                                    animalUpdated.name +
                                        ' est rentré par ' +
                                        username
                                );
                                res.status(202).json({
                                    message:
                                        'Animal rentré : ' + animalUpdated.name,
                                    newEvent
                                });
                            }
                        }
                    }
                );
            } else {
                Logging.error(NAMESPACE, "L'animal n'a pas pu être rentré");
                res.status(404).json({ message: 'Animal non rentré' });
            }
        } catch (error) {
            if (error instanceof Error.DocumentNotFoundError) {
                Logging.error(NAMESPACE, error);
                res.status(404).json({ error });
            } else {
                Logging.error(NAMESPACE, error);
                res.status(500).json({ error });
            }
        }
    }
};

const healAnimal = async (req: Request, res: Response, next: NextFunction) => {
    const { _id, observations } = req.body;
    let createdBy;

    const animal = await Animal.findById(_id).populate('specie').exec();

    if (!animal) {
        Logging.error(NAMESPACE, 'Animal not found');
        return res.status(404).json({ message: 'Animal non trouvé' });
    }

    const specie = animal.specie as Specie;
    const enclosure = specie.enclosure.toString();

    if (!req.headers.authorization) {
        Logging.error(NAMESPACE, 'Headers.Authorization absent');
        return res
            .status(500)
            .json({ message: 'Headers.Authorization absent' });
    }

    await getUserName(req.headers.authorization, async (error, username) => {
        if (error) {
            Logging.error(
                NAMESPACE,
                'Impossible de récupérer le username ' + error
            );

            return res.status(401).json({
                message: 'Username non récupéré',
                error: error
            });
        } else if (username) {
            createdBy = username;
            Logging.info(NAMESPACE, 'Employé : ' + createdBy);
        }
    });

    if (!createdBy) {
        Logging.error(NAMESPACE, 'Employé non trouvé');
        return res.status(404).json({ message: 'Employé non trouvé' });
    }

    const event = await createEvent(
        createdBy,
        enclosure,
        specie,
        [_id],
        'Soins',
        observations
    );

    Logging.info(NAMESPACE, 'Evènement soin créé' + event);

    return res.status(200).json({ message: 'Evènement créé', event });
};

export default {
    createAnimal,
    getAnimal,
    getAllAnimals,
    updateAnimal,
    deleteAnimal,
    takeAnimalOutside,
    takeAnimalInside,
    healAnimal
};
