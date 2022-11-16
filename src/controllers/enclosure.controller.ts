import { Request, Response, NextFunction } from 'express';
import Logging from '../library/logging';
import Enclosure from '../model/enclosure.model';

const NAMESPACE = 'ENCLOSURE';

const createEnclosure = (req: Request, res: Response, next: NextFunction) => {
    const { _id, name, zone, location, surface_area } = req.body;

    const enclosure = new Enclosure({
        _id,
        name,
        zone,
        location,
        surface_area
    });

    return enclosure
        .save()
        .then((enclosure) =>
            res.status(201).json({ message: 'Enclos créé', enclosure })
        )
        .catch((error) => {
            res.status(400).json({
                message: 'Erreur à la création de enclos',
                error
            });
            Logging.error(NAMESPACE, error);
        });
};

const getEnclosure = (req: Request, res: Response, next: NextFunction) => {
    const enclosureId = req.params.enclosureId;

    return Enclosure.findById(enclosureId)
        .then((enclosure) =>
            enclosure
                ? res.status(200).json({ message: 'Enclos trouvé', enclosure })
                : res.status(404).json({ message: 'Enclos non trouvé' })
        )
        .catch((error) => {
            res.status(500).json({ error });
            Logging.error(NAMESPACE, error);
        });
};

const getAllEnclosure = (req: Request, res: Response, next: NextFunction) => {
    return Enclosure.find()
        .then((enclosures) =>
            res.status(200).json({ message: 'Liste des enclos', enclosures })
        )
        .catch((error) => {
            res.status(500).json({ error });
            Logging.error(NAMESPACE, error);
        });
};

const updateEnclosure = (req: Request, res: Response, next: NextFunction) => {
    const enclosureId = req.params.enclosureId;

    return Enclosure.findById(enclosureId)
        .then((enclosure) => {
            if (enclosure) {
                enclosure.set(req.body);

                return enclosure
                    .save()
                    .then((enclosure) =>
                        res.status(200).json({
                            message: 'Enclos mis à jour',
                            enclosure
                        })
                    )
                    .catch((error) => {
                        res.status(400).json({ error });
                        Logging.error(NAMESPACE, error);
                    });
            } else {
                res.status(404).json({ message: 'Enclos not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
            Logging.error(NAMESPACE, error);
        });
};

const deleteEnclosure = (req: Request, res: Response, next: NextFunction) => {
    const enclosureId = req.body.enclosureId;

    return Enclosure.findByIdAndDelete(enclosureId)
        .then((enclosure) =>
            enclosure
                ? res
                      .status(200)
                      .json({ message: 'Enclos supprimé', enclosure })
                : res.status(404).json({ message: 'Enclos non trouvé' })
        )
        .catch((error) => {
            res.status(500).json({ error });
            Logging.error(NAMESPACE, error);
        });
};

export default {
    createEnclosure,
    getEnclosure,
    getAllEnclosure,
    updateEnclosure,
    deleteEnclosure
};
