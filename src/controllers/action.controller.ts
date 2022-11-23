import { Request, Response, NextFunction } from 'express';
import { getUserName } from '../functions/getUserName';
import { isZoneAuthorized } from '../functions/isZoneAuthorized';
import { areJSONDataOK } from '../functions/checkJSONData';
import Logging from '../library/logging';
import EmployeeModel from '../model/Employee.model';
import Action from '../model/action.model';

const NAMESPACE = 'ACTION';

const createAction = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { enclosure, specie, animal, plannedDate, observation } = req.body;
    let createdBy;

    const JSONOk = await areJSONDataOK(enclosure, specie, animal);

    if (!JSONOk) {
        Logging.error(NAMESPACE, 'Le JSON est NOK');
        return res
            .status(400)
            .json({ message: 'Les données saisies sont incorrectes' });
    }

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

        const action = new Action({
            createdBy,
            enclosure,
            specie,
            animal,
            plannedDate,
            observation
        });

        return action
            .save()
            .then((action) =>
                res.status(201).json({ message: 'Action créée ', action })
            )
            .catch((error) => {
                res.status(500).json({ message: 'Action non créée', error });
                Logging.error(NAMESPACE, error);
            });
    }
};

export default { createAction };
