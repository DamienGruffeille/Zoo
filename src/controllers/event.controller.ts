import { Request, Response, NextFunction } from 'express';
import { getUserName } from '../functions/getUserName';
import { isZoneAuthorized } from '../functions/isZoneAuthorized';
import Logging from '../library/logging';
import EmployeeModel from '../model/Employee.model';
import Event from '../model/event.model';
import Enclos from '../model/enclosure.model';
import Specie from '../model/specie.model';
import Animal from '../model/animal.model';
import Zone from '../model/zone.model';
import { areJSONDataOK } from '../functions/checkJSONData';

const NAMESPACE = 'EVENT';

const createEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { enclosure, specie, animal, eventType, observations } = req.body;
    let createdBy;

    const JSONOk = await areJSONDataOK(enclosure, specie, animal);

    if (!JSONOk) {
        Logging.error(NAMESPACE, 'Le JSON est NOK');
        return res
            .status(400)
            .json({ message: 'Les données saisies sont incorrectes' });
    } else {
        Logging.info(NAMESPACE, 'Le JSON est OK');
    }

    /** Récupération du username dans le headers.authorization */
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

        /** Si l'employé existe et est autorisé sur la zone, vérification si son rôle lui permet de publier le type d'évenement */
        let authorizedToPublish = false;

        switch (employee.role) {
            case 'Vétérinaire': {
                authorizedToPublish = true;
                break;
            }
            case 'Responsable': {
                if (
                    eventType === 'Bagarre' ||
                    eventType === 'Accident' ||
                    eventType === 'Vérification'
                ) {
                    authorizedToPublish = true;
                }
                break;
            }
            case 'Soigneur': {
                if (eventType === 'Bagarre' || eventType === 'Accident') {
                    authorizedToPublish = true;
                }
                break;
            }
        }

        Logging.info(NAMESPACE, 'Authorized ? ' + authorizedToPublish);

        /** L'employé est autorisé à déclarer cet évènement */
        if (authorizedToPublish) {
            const event = new Event({
                createdBy,
                enclosure,
                specie,
                animal,
                eventType,
                observations
            });

            return event
                .save()
                .then((event) =>
                    res
                        .status(201)
                        .json({ message: 'Evènement créé : ', event })
                )
                .catch((error) => {
                    res.status(500).json({
                        message: 'Evènement non créé',
                        error
                    });
                    Logging.error(NAMESPACE, error);
                });
        } else {
            Logging.error(
                NAMESPACE,
                'Employé non autorisé à signaler cet évènement'
            );
            return res.status(400).json({
                message: 'Employé non autorisé à signaler cet évènement'
            });
        }
    }
};

const getEventsByZone = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const zoneId = req.params.id;

    try {
        const zone = await Zone.findById(zoneId).exec();

        if (!zone) {
            Logging.info(NAMESPACE, 'Zone inexistante : ' + zoneId);
            return res.status(404).json({
                message: 'Zone inexistante : ' + zoneId
            });
        }

        const enclos = await Enclos.find({ zone: zoneId })
            .select('zone')
            .exec();

        Logging.info(NAMESPACE, 'Enclos de la zone ' + zoneId + ' : ' + enclos);

        // S'il n'y a aucun enclos dans la zone demandée, envoi d'une réponse NOK
        if (enclos.length === 0) {
            return res.status(404).json({
                message: 'Aucun enclos dans la zone :  ' + zone.name
            });
        }

        // Récupération des évènements liés à la zone demandée
        const events = await Event.find({ enclosure: { $in: enclos } }).exec();

        // S'il n'y a aucun évènement, envoi d'une reponse OK indiquant qu'aucun évènement n'existe pour cette zone
        if (events.length === 0) {
            Logging.info(
                NAMESPACE,
                'Aucun évènements sur la zone : ' + zone.name
            );
            return res.status(200).json({
                message: 'Aucun évènement sur la zone : ' + zone.name
            });
        }

        Logging.info(
            NAMESPACE,
            'Evenements de la zone ' + zone.name + ' : ' + events
        );

        return res.status(200).json({
            message: 'Evenements de la zone ' + zone.name + ' : ',
            events
        });
    } catch (error) {
        return res.status(404).json({
            message:
                'Impossible de récupérer les évènements de la zone :  ' +
                zoneId,
            error
        });
    }
};

const getEventsByEnclosure = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const enclosureId = req.params.id;

    try {
        const enclosure = await Enclos.findById(enclosureId).exec();

        if (!enclosure) {
            Logging.info(NAMESPACE, "Enclos inexistant' : " + enclosureId);
            return res.status(404).json({
                message: 'Enclos inexistant :  ' + enclosureId
            });
        }

        const events = await Event.find({ enclosure: enclosureId }).exec();

        if (events.length === 0) {
            Logging.info(
                NAMESPACE,
                "Aucun évènement sur l'enclos' : " + enclosure.name
            );
            return res.status(200).json({
                message: "Aucun évènement sur l'enclos : " + enclosure.name
            });
        }

        Logging.info(
            NAMESPACE,
            "Evenements de l'enclos " + enclosure.name + ' : ' + events
        );
        return res.status(200).json({
            message: "Evènements pour l'enclos " + enclosure.name + ' : ',
            events
        });
    } catch (error) {
        return res.status(404).json({
            message:
                "Impossible de récupérer les évènements de l'enclos :  " +
                enclosureId,
            error
        });
    }
};

const getEventsBySpecie = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const specieId = req.params.id;
    try {
        const specie = await Specie.findById(specieId).exec();

        if (!specie) {
            Logging.info(NAMESPACE, 'Espèce inexistante : ' + specieId);
            return res.status(404).json({
                message: 'Espèce inexistante : ' + specieId
            });
        }

        const events = await Event.find({ specie: specieId }).exec();

        if (events.length === 0) {
            Logging.info(
                NAMESPACE,
                "Aucun évènement pour l'espèce : " + specie.name
            );
            return res.status(200).json({
                message: "Aucun évènement pour l'espèce : " + specie.name
            });
        }

        Logging.info(
            NAMESPACE,
            "Evenements pour l'espèce " + specie.name + ' : ' + events
        );
        return res.status(200).json({
            message: "Evènements pour l'espèce " + specie.name + ' : ',
            events
        });
    } catch (error) {
        return res.status(404).json({
            message:
                "Impossible de récupérer les évènements de l'espèce :  " +
                specieId,
            error
        });
    }
};

const getLastEventBySpecie = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const specieId = req.query._id;
    const eventType = req.query.eventType;

    Logging.info(NAMESPACE, specieId + ' ' + eventType);

    try {
        const specie = await Specie.findById(specieId).exec();

        if (!specie) {
            Logging.info(NAMESPACE, 'Espèce inexistante : ' + specieId);
            return res.status(404).json({
                message: 'Espèce inexistante : ' + specieId
            });
        }

        const events = await Event.findOne({
            specie: specieId,
            eventType: eventType
        })
            .sort({ createdAt: -1 })
            .exec();

        if (!events) {
            Logging.info(
                NAMESPACE,
                "Aucun évènement pour l'espèce : " + specie.name
            );
            return res.status(200).json({
                message: "Aucun évènement pour l'espèce : " + specie.name
            });
        }

        Logging.info(
            NAMESPACE,
            "Evenements pour l'espèce " + specie.name + ' : ' + events
        );
        return res.status(200).json({
            message: "Evènements pour l'espèce " + specie.name + ' : ',
            events
        });
    } catch (error) {
        return res.status(404).json({
            message:
                "Impossible de récupérer les évènements de l'espèce :  " +
                specieId,
            error
        });
    }
};

const getEventsByAnimal = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const animalId = req.params.id;

    try {
        const animal = await Animal.findById(animalId).exec();

        if (!animal) {
            Logging.info(NAMESPACE, 'Individu inexistant : ' + animalId);
            return res.status(404).json({
                message: 'Individu inexistant : ' + animalId
            });
        }

        const events = await Event.find({ animal: animalId }).exec();

        if (events.length === 0) {
            Logging.info(
                NAMESPACE,
                "Aucun évènement pour l'individu : " + animal.name
            );
            return res.status(200).json({
                message: "Aucun évènement pour l'individu : " + animal.name
            });
        }

        Logging.info(
            NAMESPACE,
            "Evenements pour l'individu " + animal.name + ' : ' + events
        );
        return res.status(200).json({
            message: "Evènements pour l'individu " + animal.name + ' : ',
            events
        });
    } catch (error) {
        return res.status(404).json({
            message:
                "Impossible de récupérer les évènements de l'individu :  " +
                animalId,
            error
        });
    }
};

export default {
    createEvent,
    getEventsByZone,
    getEventsByEnclosure,
    getLastEventBySpecie,
    getEventsBySpecie,
    getEventsByAnimal
};
