import { Request, Response, NextFunction } from 'express';
import Animal from '../model/animal.model';
import Logging from '../library/logging';
import { Error } from 'mongoose';

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
    const animalId = req.body._id;

    const animalPosition = await Animal.findById(animalId)
        .select('position')
        .exec();

    Logging.info(NAMESPACE, 'Animal position = ' + animalPosition);

    if (animalPosition?.position === 'Dehors') {
        res.status(400).json({ message: "L'animal est déjà dehors" });
    } else {
        try {
            await Animal.findOneAndUpdate(
                { _id: animalId },
                { position: 'Dehors' }
            )
                .orFail()
                .exec();

            const animal = await Animal.findById(animalId).exec();

            res.status(202).json({ message: 'Animal sorti :', animal });
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

const takeAnimalInside = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const animalId = req.body._id;
    const animalPosition = await Animal.findById(animalId)
        .select('position')
        .exec();

    if (animalPosition?.position === 'Dedans') {
        res.status(400).json({ message: "L'animal est déjà à l'intérieur" });
    } else {
        try {
            await Animal.findOneAndUpdate(
                { _id: animalId },
                { position: 'Dedans' }
            )
                .orFail()
                .exec();

            const animal = await Animal.findById(animalId).exec();

            res.status(202).json({ message: 'Animal rentré :', animal });
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
    createAnimal,
    getAnimal,
    getAllAnimals,
    updateAnimal,
    deleteAnimal,
    takeAnimalOutside,
    takeAnimalInside
};
