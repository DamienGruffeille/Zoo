import { Request, Response, NextFunction } from 'express';
import { getUserName } from '../functions/getUserName';
import { isZoneAuthorized } from '../functions/isZoneAuthorized';
import Logging from '../library/logging';
import EmployeeModel from '../model/Employee.model';
import Event from '../model/event.model';

const NAMESPACE = 'Event';

const createEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { enclosure, specie, animal, eventType, observations } = req.body;
    let createdBy;

    /** Récupération du username dans le headers.authorization */
    if (req.headers.authorization) {
        await getUserName(
            req.headers.authorization,
            async (error, username) => {
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
            }
        );

        if (createdBy) {
            /** Vérification que l'employé(e) a les droits sur la zone */
            const zoneAuthorized = await isZoneAuthorized(createdBy, enclosure);

            const employee = await EmployeeModel.findOne({ name: createdBy })
                .select('role')
                .exec();

            Logging.info(
                NAMESPACE,
                'Zone autorisée : ' +
                    zoneAuthorized +
                    ' / employee : ' +
                    employee?.role
            );

            let authorizedToPublish = false;
            if (zoneAuthorized && employee) {
                switch (employee.role) {
                    case 'Vétérinaire': {
                        authorizedToPublish = true;
                        break;
                    }
                    case 'Responsable': {
                        switch (eventType) {
                            case 'Bagarre': {
                                authorizedToPublish = true;
                                break;
                            }
                            case 'Accident': {
                                authorizedToPublish = true;
                                break;
                            }
                            case 'Vérification': {
                                authorizedToPublish = true;
                                break;
                            }
                        }
                    }
                    case 'Soigneur': {
                        switch (eventType) {
                            case 'Bagarre': {
                                authorizedToPublish = true;
                                break;
                            }
                            case 'Accident': {
                                authorizedToPublish = true;
                                break;
                            }
                        }
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
                                .json({ message: 'Evènement créé : ' + event })
                        )
                        .catch((error) => {
                            res.status(500).json({
                                message: 'Evènement non créé',
                                error
                            });
                            Logging.error(NAMESPACE, error);
                        });
                }
            } else {
                Logging.error(
                    NAMESPACE,
                    'Utilisation non habilité. Zone autorisée ?  ' +
                        zoneAuthorized +
                        ' / Role employé : ' +
                        employee?.role
                );
                res.status(400).json({
                    message: 'Utilisateur non habilité à créer cet évènement'
                });
            }
        }
    }
};

export default { createEvent };
