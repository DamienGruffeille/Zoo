import { Request, Response, NextFunction } from 'express';
import Animal from '../model/animal.model';
import Logging from '../library/logging';

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

export default {
    createAnimal,
    getAnimal,
    getAllAnimals,
    updateAnimal,
    deleteAnimal
};
