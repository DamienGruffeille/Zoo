import { Request, Response, NextFunction } from 'express';
import Logging from '../library/logging';
import Specie from '../model/specie.model';

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

export default {
    createSpecie,
    getSpecie,
    getAllSpecies,
    updateSpecie,
    deleteSpecie
};
