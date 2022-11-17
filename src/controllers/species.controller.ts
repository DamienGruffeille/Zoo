import { Request, Response, NextFunction } from 'express';
import Logging from '../library/logging';
import Specie from '../model/specie.model';
import Animal from '../model/animal.model';
import IAnimal from '../interface/animal.interface';
import { Error } from 'mongoose';

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

const takeAnimalsOutside = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const specieId = req.body._id;
    const stillInsideAnimals = req.body.stillInsideAnimals;

    if (stillInsideAnimals === undefined) {
        Logging.warn(
            NAMESPACE,
            'Le tableau des animaux non sortis est absent !'
        );
        res.status(400).json({
            message:
                'La liste des animaux qui ne sont pas sortis est obligatoire !'
        });
    } else {
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
            const insideAnimals = await Animal.find({
                specie: specieId,
                position: 'Dedans'
            }).exec();

            res.status(200).json({
                message: 'Liste des animaux sortis',
                animauxSortis: outsideAnimals,
                animauxNonSortis: insideAnimals
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
    }
};

const takeAnimalsInside = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const specieId = req.body._id;
    const stillOutsideAnimals = req.body.stillOutsideAnimals;

    if (stillOutsideAnimals === undefined) {
        Logging.warn(
            NAMESPACE,
            'Le tableau des animaux non rentrés est absent !'
        );
        res.status(400).json({
            message:
                'La liste des animaux qui ne sont pas rentrés est obligatoire !'
        });
    } else {
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
            const insideAnimals = await Animal.find({
                specie: specieId,
                position: 'Dedans'
            }).exec();

            res.status(200).json({
                message: 'Liste des animaux rentrés',
                animauxRentrés: insideAnimals,
                animauxNonRentrés: outsideAnimals
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
    }
};

export default {
    createSpecie,
    getSpecie,
    getAllSpecies,
    updateSpecie,
    deleteSpecie,
    takeAnimalsOutside,
    takeAnimalsInside
};
