import { Request, Response, NextFunction } from 'express';
import Pond from '../model/pond.model';

const createPond = (req: Request, res: Response, next: NextFunction) => {
    const {
        _id,
        name,
        zone,
        location,
        surface_area,
        minTemperature,
        maxTemperature
    } = req.body;

    const pond = new Pond({
        _id,
        name,
        zone,
        location,
        surface_area,
        minTemperature,
        maxTemperature
    });

    return pond
        .save()
        .then((pond) => res.status(201).json({ message: 'Bassin créé', pond }))
        .catch((error) =>
            res
                .status(400)
                .json({ message: 'Erreur à la création du bassin', error })
        );
};

const getPond = (req: Request, res: Response, next: NextFunction) => {
    const pondId = req.params.pondId;

    return Pond.findById(pondId)
        .then((pond) =>
            pond
                ? res.status(200).json({ message: 'Bassin trouvé', pond })
                : res.status(404).json({ message: 'Bassin non trouvé' })
        )
        .catch((error) => res.status(500).json({ error }));
};

const getAllPond = (req: Request, res: Response, next: NextFunction) => {
    return Pond.find()
        .then((ponds) =>
            res.status(200).json({ message: 'Liste des bassins', ponds })
        )
        .catch((error) => res.status(500).json({ error }));
};

const updatePond = (req: Request, res: Response, next: NextFunction) => {
    const pondId = req.params.pondId;

    return Pond.findById(pondId)
        .then((pond) => {
            if (pond) {
                pond.set(req.body);

                return pond
                    .save()
                    .then((pond) =>
                        res.status(200).json({
                            message: 'Bassin mis à jour',
                            pond
                        })
                    )
                    .catch((error) => res.status(400).json({ error }));
            } else {
                res.status(404).json({ message: 'Pond not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

const deletePond = (req: Request, res: Response, next: NextFunction) => {
    const pondId = req.params.pondId;

    return Pond.findByIdAndDelete(pondId)
        .then((pond) =>
            pond
                ? res.status(200).json({ message: 'Bassin supprimé', pond })
                : res.status(404).json({ message: 'Bassin non trouvé' })
        )
        .catch((error) => res.status(500).json({ error }));
};

export default {
    createPond,
    getPond,
    getAllPond,
    updatePond,
    deletePond
};
