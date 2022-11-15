import { Request, Response, NextFunction } from 'express';
import Vivarium from '../model/vivarium.model';

const createVivarium = (req: Request, res: Response, next: NextFunction) => {
    const { _id, name, zone, location, surface_area, temperature, humidity } =
        req.body;

    const vivarium = new Vivarium({
        _id,
        name,
        zone,
        location,
        surface_area,
        temperature,
        humidity
    });

    return vivarium
        .save()
        .then((vivarium) =>
            res.status(201).json({ message: 'Vivarium créé', vivarium })
        )
        .catch((error) =>
            res
                .status(400)
                .json({ message: 'Erreur à la création de enclos', error })
        );
};

const getVivarium = (req: Request, res: Response, next: NextFunction) => {
    const vivariumId = req.params.vivariumId;

    return Vivarium.findById(vivariumId)
        .then((vivarium) =>
            vivarium
                ? res.status(200).json({ message: 'Vivarium trouvé', vivarium })
                : res.status(404).json({ message: 'Vivarium non trouvé' })
        )
        .catch((error) => res.status(500).json({ error }));
};

const getAllVivarium = (req: Request, res: Response, next: NextFunction) => {
    return Vivarium.find()
        .then((vivariums) =>
            res.status(200).json({ message: 'Liste des vivariums', vivariums })
        )
        .catch((error) => res.status(500).json({ error }));
};

const updateVivarium = (req: Request, res: Response, next: NextFunction) => {
    const vivariumId = req.params.vivariumId;

    return Vivarium.findById(vivariumId)
        .then((vivarium) => {
            if (vivarium) {
                vivarium.set(req.body);

                return vivarium
                    .save()
                    .then((vivarium) =>
                        res.status(200).json({
                            message: 'Vivarium mis à jour',
                            vivarium
                        })
                    )
                    .catch((error) => res.status(400).json({ error }));
            } else {
                res.status(404).json({ message: 'Enclos not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

const deleteVivarium = (req: Request, res: Response, next: NextFunction) => {
    const vivariumId = req.params.vivariumId;

    return Vivarium.findByIdAndDelete(vivariumId)
        .then((vivarium) =>
            vivarium
                ? res
                      .status(200)
                      .json({ message: 'Vivarium supprimé', vivarium })
                : res.status(404).json({ message: 'Vivarium non trouvé' })
        )
        .catch((error) => res.status(500).json({ error }));
};

export default {
    createVivarium,
    getVivarium,
    getAllVivarium,
    updateVivarium,
    deleteVivarium
};
