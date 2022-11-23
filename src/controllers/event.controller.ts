import { info } from 'console';
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
    } else {
        Logging.error(NAMESPACE, 'Headers.Authorization absent');
        return res
            .status(500)
            .json({ message: 'Headers.Authorization absent' });
    }

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

        if (!zoneAuthorized) {
            return res
                .status(404)
                .json({ message: 'Zone non autorisée pour cet employé' });
        }

        if (!employee) {
            return res.status(404).json({ message: 'Employé non trouvé' });
        }

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

export default { createEvent };
