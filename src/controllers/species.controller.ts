import { Request, Response, NextFunction } from 'express';
import Logging from '../library/logging';
import Specie from '../model/specie.model';
import Animal from '../model/animal.model';
import { Error } from 'mongoose';
import { createEvent } from '../functions/createEvent';
import { getUserName } from '../functions/getUserName';
import { isZoneAuthorized } from '../functions/isZoneAuthorized';

const NAMESPACE = 'SPECIES';

const createSpecie = (req: Request, res: Response, next: NextFunction) => {
    const { _id, name, sociable, observations, dangerous, enclosure } =
        req.body;

    const specie = new Specie({
        _id,
        name,
        sociable,
        observations,
        dangerous,
        enclosure
    });

    return specie
        .save()
        .then((specie) =>
            res.status(201).json({ message: 'Espèce créée', specie })
        )
        .catch((error) => {
            res.status(400).json({ message: 'Espèce non créée', error });
            Logging.error(NAMESPACE, error);
        });
};

const getSpecie = (req: Request, res: Response, next: NextFunction) => {
    const specieId = req.params.specieId;

    return Specie.findById(specieId)
        .populate('enclosure')
        .then((specie) =>
            specie
                ? res.status(200).json({ message: 'Espèce trouvée', specie })
                : res.status(404).json({ message: 'Espèce non trouvée' })
        )
        .catch((error) => {
            res.status(500).json({ error });
            Logging.error(NAMESPACE, error);
        });
};

const getAllSpecies = (req: Request, res: Response, next: NextFunction) => {
    return Specie.find()
        .then((species) =>
            res.status(200).json({ message: 'Liste des espèces', species })
        )
        .catch((error) => {
            res.status(500).json({ error });
            Logging.error(NAMESPACE, error);
        });
};

const updateSpecie = (req: Request, res: Response, next: NextFunction) => {
    const specieId = req.params.specieId;

    return Specie.findById(specieId)
        .then((specie) => {
            if (specie) {
                specie.set(req.body);

                return specie
                    .save()
                    .then((specie) =>
                        res
                            .status(200)
                            .json({ message: 'Espèce mise à jour', specie })
                    )
                    .catch((error) => {
                        res.status(404).json({ error });
                        Logging.error(NAMESPACE, error);
                    });
            } else {
                res.status(404).json({ message: 'Espèce non trouvée' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
            Logging.error(NAMESPACE, error);
        });
};

const deleteSpecie = (req: Request, res: Response, next: NextFunction) => {
    const specieId = req.params.specieId;

    return Specie.findById(specieId)
        .then((specie) =>
            specie
                ? res.status(200).json({ message: 'Espèce supprimée', specie })
                : res.status(404).json({ message: 'Espèce non trouvée' })
        )
        .catch((error) => {
            res.status(500).json({ error });
            Logging.error(NAMESPACE, error);
        });
};

const takeSpecieOutside = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const specieId = req.body._id;
    const stillInsideAnimals = req.body.stillInsideAnimals;

    if (!stillInsideAnimals) {
        Logging.warn(
            NAMESPACE,
            'Le tableau des animaux non sortis est absent !'
        );
        return res.status(400).json({
            message:
                'La liste des animaux qui ne sont pas sortis est obligatoire !'
        });
    }

    try {
        await Animal.updateMany(
            { specie: specieId, _id: { $nin: stillInsideAnimals } },
            { position: 'Dehors' }
        )
            .orFail()
            .exec();

        const outsideAnimals = await Animal.find({
            specie: specieId,
            position: 'Dehors'
        }).exec();

        let outsideAnimalArray: string[] = [];

        outsideAnimals.forEach((animal) => {
            outsideAnimalArray.push(animal._id);
        });

        const insideAnimals = await Animal.find({
            specie: specieId,
            position: 'Dedans'
        }).exec();

        let insideAnimalArray: string[] = [];

        insideAnimals.forEach((animal) => {
            insideAnimalArray.push(animal._id);
        });

        const specie = await Specie.findById(specieId)
            .select('enclosure')
            .orFail()
            .exec();

        if (!req.headers.authorization) {
            return res
                .status(500)
                .json({ message: 'Headers.authorization est manquant' });
        }

        Logging.info(NAMESPACE, 'Le header a bien été envoyé');

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
                if (
                    await isZoneAuthorized(
                        username,
                        specie.enclosure.toString()
                    )
                ) {
                    /** L'employé(e) est bien habilité(e) donc on créé l'évènement */
                    const newEvent = await createEvent(
                        username,
                        specie.enclosure.toString(),
                        specie,
                        outsideAnimalArray,
                        'Sortie',
                        'Animaux non sortis : ' + insideAnimalArray.toString()
                    );
                    Logging.info(
                        NAMESPACE,

                        ' Les animaux suivants sont sortis : ' +
                            outsideAnimalArray
                    );
                    return res.status(202).json({
                        message: 'Animaux sortis : ' + outsideAnimalArray,
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

const takeSpecieInside = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const specieId = req.body._id;
    const stillOutsideAnimals = req.body.stillOutsideAnimals;

    if (!stillOutsideAnimals) {
        Logging.warn(
            NAMESPACE,
            'Le tableau des animaux non rentrés est absent !'
        );
        return res.status(400).json({
            message:
                'La liste des animaux qui ne sont pas rentrés est obligatoire !'
        });
    }

    try {
        await Animal.updateMany(
            { specie: specieId, _id: { $nin: stillOutsideAnimals } },
            { position: 'Dedans' }
        )
            .orFail()
            .exec();

        const outsideAnimals = await Animal.find({
            specie: specieId,
            position: 'Dehors'
        }).exec();

        let outsideAnimalArray: string[] = [];

        outsideAnimals.forEach((animal) => {
            outsideAnimalArray.push(animal._id);
        });

        const insideAnimals = await Animal.find({
            specie: specieId,
            position: 'Dedans'
        }).exec();

        let insideAnimalArray: string[] = [];

        insideAnimals.forEach((animal) => {
            insideAnimalArray.push(animal._id);
        });

        const specie = await Specie.findById(specieId)
            .select('enclosure')
            .orFail()
            .exec();

        if (!req.headers.authorization) {
            return res
                .status(500)
                .json({ message: 'Headers.authorization manquant' });
        }

        Logging.info(NAMESPACE, 'Le header a bien été envoyé');

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
                if (
                    await isZoneAuthorized(
                        username,
                        specie.enclosure.toString()
                    )
                ) {
                    /** L'employé(e) est bien habilité(e) donc on créé l'évènement */
                    const newEvent = await createEvent(
                        username,
                        specie.enclosure.toString(),
                        specie,
                        insideAnimalArray,
                        'Entrée',
                        'Animaux non rentrés : ' + outsideAnimalArray.toString()
                    );
                    Logging.info(
                        NAMESPACE,

                        ' Les animaux suivants sont rentrés : ' +
                            insideAnimalArray
                    );
                    return res.status(202).json({
                        message: 'Animaux rentrés : ' + insideAnimalArray,
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

const feedSpecie = async (req: Request, res: Response, next: NextFunction) => {
    const specieId = req.body._id;

    try {
        const specie = await Specie.findById(specieId).orFail().exec();
        const enclosure: any = specie.enclosure;
        const animals = await Animal.find({ specie: specie })
            .select('_id')
            .exec();

        const animalArray: string[] = [];

        animals.forEach((animal) => {
            animalArray.push(animal._id);
        });

        if (req.headers.authorization) {
            Logging.info(NAMESPACE, 'Le header a bien été envoyé');

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
                    if (
                        await isZoneAuthorized(
                            username,
                            specie.enclosure.toString()
                        )
                    ) {
                        /** L'employé(e) est bien habilité(e) donc on créé l'évènement */
                        const newEvent = await createEvent(
                            username,
                            enclosure,
                            specie,
                            animalArray,
                            'Nourrissage',
                            ''
                        );
                        Logging.info(
                            NAMESPACE,

                            ' Les animaux suivants ont été nourris : ' +
                                animalArray
                        );
                        res.status(202).json({
                            message: 'Animaux nourris : ' + animalArray,
                            newEvent
                        });
                    } else {
                        /** L'employé(e) n'est pas habilité sur la zone */
                        res.status(404).json({
                            message: 'Soigneur non habilité pour cette zone'
                        });
                    }
                }
            });
        } else {
            res.status(404).json({ message: 'Espèce non nourrie' });
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
};

const stimulateSpecie = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const specieId = req.body._id;

    try {
        const specie = await Specie.findById(specieId).orFail().exec();
        const enclosure: any = specie.enclosure;
        const animals = await Animal.find({ specie: specie })
            .select('_id')
            .exec();

        const animalArray: string[] = [];

        animals.forEach((animal) => {
            animalArray.push(animal._id);
        });

        if (req.headers.authorization) {
            Logging.info(NAMESPACE, 'Le header a bien été envoyé');

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
                    if (
                        await isZoneAuthorized(
                            username,
                            specie.enclosure.toString()
                        )
                    ) {
                        /** L'employé(e) est bien habilité(e) donc on créé l'évènement */
                        const newEvent = await createEvent(
                            username,
                            enclosure,
                            specie,
                            animalArray,
                            'Stimulation',
                            ''
                        );
                        Logging.info(
                            NAMESPACE,

                            ' Les animaux suivants ont été stimulés : ' +
                                animalArray
                        );
                        res.status(202).json({
                            message: 'Animaux stimulés : ' + animalArray,
                            newEvent
                        });
                    } else {
                        /** L'employé(e) n'est pas habilité sur la zone */
                        res.status(404).json({
                            message: 'Soigneur non habilité pour cette zone'
                        });
                    }
                }
            });
        } else {
            res.status(404).json({ message: 'Espèce non stimulée' });
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
};

export default {
    createSpecie,
    getSpecie,
    getAllSpecies,
    updateSpecie,
    deleteSpecie,
    takeSpecieOutside,
    takeSpecieInside,
    feedSpecie,
    stimulateSpecie
};
