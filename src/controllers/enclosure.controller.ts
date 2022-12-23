import { Request, Response, NextFunction } from 'express';
import { getUserName } from '../functions/getUserName';
import { isZoneAuthorized } from '../functions/isZoneAuthorized';
import Logging from '../library/logging';
import EmployeeModel from '../model/Employee.model';
import Enclosure from '../model/enclosure.model';
import Event from '../model/event.model';
import Specie from '../model/specie.model';
import Animal from '../model/animal.model';

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

const getEnclosuresByZone = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const zoneId = req.params.zoneId;
    console.log('Zone Id: ' + zoneId);

    if (zoneId === 'toutes') {
        console.log('zone1 = toutes');
        return Enclosure.find()
            .then((enclosures) =>
                res
                    .status(200)
                    .json({ message: 'Liste des enclos', enclosures })
            )
            .catch((error) => {
                res.status(500).json({ error });
                Logging.error(NAMESPACE, error);
            });
    } else {
        console.log('zone2 : ' + zoneId);
        return Enclosure.find({ zone: zoneId })
            .then((enclosures) =>
                enclosures
                    ? res
                          .status(200)
                          .json({ message: 'Enclos trouvés', enclosures })
                    : res.status(404).json({ message: 'Enclos non trouvé' })
            )
            .catch((error) => {
                res.status(500).json({ error });
                Logging.error(NAMESPACE, error);
            });
    }
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

const checkEnclosure = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { enclosure, observations } = req.body;
    let createdBy;

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

    if (createdBy) {
        /** Vérification que l'employé(e) a les droits sur la zone */
        const zoneAuthorized = await isZoneAuthorized(createdBy, enclosure);

        if (!zoneAuthorized) {
            Logging.error(NAMESPACE, 'Zone non autorisée pour cet employé');
            return res
                .status(404)
                .json({ message: 'Zone non autorisée pour cet employé' });
        }

        const employee = await EmployeeModel.findOne({ name: createdBy })
            .select('role')
            .exec();

        if (!employee) {
            Logging.error(NAMESPACE, 'Employé non trouvé');
            return res.status(404).json({ message: 'Employé non trouvé' });
        }

        Logging.info(
            NAMESPACE,
            'Zone autorisée : ' +
                zoneAuthorized +
                ' / employee : ' +
                employee?.role
        );

        const specie = await Specie.findOne({ enclosure: enclosure }).exec();
        if (!specie) {
            Logging.error(NAMESPACE, 'Espèce non trouvée');
            return res.status(404).json({ message: 'Espèce non trouvée' });
        }

        const specieId = specie._id;

        const animals = await Animal.find({ specie: specie._id }).exec();

        const event = new Event({
            createdBy,
            enclosure,
            specie: specieId,
            animals,
            eventType: 'Vérification',
            observations
        });

        return event
            .save()
            .then((event) =>
                res.status(200).json({ message: 'Evènement créé : ', event })
            )
            .catch((error) => {
                res.status(500).json({
                    message: 'Evènement non créé',
                    error
                });
                Logging.error(NAMESPACE, error);
            });
    }
};

export default {
    createEnclosure,
    getEnclosure,
    getAllEnclosure,
    getEnclosuresByZone,
    updateEnclosure,
    deleteEnclosure,
    checkEnclosure
};
