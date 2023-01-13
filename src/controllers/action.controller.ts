import { Request, Response, NextFunction } from 'express';
import { getUserName } from '../functions/getUserName';
import { isZoneAuthorized } from '../functions/isZoneAuthorized';
import { areJSONDataOK } from '../functions/checkJSONData';
import Logging from '../library/logging';
import EmployeeModel from '../model/Employee.model';
import Action from '../model/action.model';
import Zone from '../model/zone.model';
import Enclos from '../model/enclosure.model';
import Specie from '../model/specie.model';
import Animal from '../model/animal.model';

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

const getAllActions = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const actions = await Action.find().exec();

    return res.status(200).json({ actions });
};

const getActionsByEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const employeeName = req.params.employeeName;
        console.log('Employé : ' + employeeName);

        const actions = await Action.find({ createdBy: employeeName }).exec();

        console.log('Actions : ' + actions);

        return res.status(200).json({ actions });
    } catch (error) {
        return res.status(404).json({ message: error });
    }
};

const getActionsByZone = async (
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
        const actions = await Action.find({
            enclosure: { $in: enclos }
        }).exec();

        // S'il n'y a aucun évènement, envoi d'une reponse OK indiquant qu'aucun évènement n'existe pour cette zone
        if (actions.length === 0) {
            Logging.info(NAMESPACE, 'Aucune action sur la zone : ' + zone.name);
            return res.status(200).json({
                message: 'Aucune action sur la zone : ' + zone.name
            });
        }

        Logging.info(
            NAMESPACE,
            'Actions de la zone ' + zone.name + ' : ' + actions
        );

        return res.status(200).json({
            message: 'Actions de la zone ' + zone.name + ' : ',
            actions
        });
    } catch (error) {
        return res.status(404).json({
            message:
                'Impossible de récupérer les actions de la zone :  ' + zoneId,
            error
        });
    }
};

const getActionsByEnclosure = async (
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

        const actions = await Action.find({ enclosure: enclosureId }).exec();

        if (actions.length === 0) {
            Logging.info(
                NAMESPACE,
                "Aucune action sur l'enclos' : " + enclosure.name
            );
            return res.status(200).json({
                message: "Aucune action sur l'enclos : " + enclosure.name
            });
        }

        Logging.info(
            NAMESPACE,
            "Actions de l'enclos " + enclosure.name + ' : ' + actions
        );
        return res.status(200).json({
            message: "Actions pour l'enclos " + enclosure.name + ' : ',
            actions
        });
    } catch (error) {
        return res.status(404).json({
            message:
                "Impossible de récupérer les actions de l'enclos :  " +
                enclosureId,
            error
        });
    }
};

const getActionsBySpecie = async (
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

        const actions = await Action.find({ specie: specieId })
            .sort({ createdAt: -1 })
            .exec();

        if (actions.length === 0) {
            Logging.info(
                NAMESPACE,
                "Aucune action pour l'espèce : " + specie.name
            );
            return res.status(200).json({
                message: "Aucune action pour l'espèce : " + specie.name
            });
        }

        Logging.info(
            NAMESPACE,
            "Actions pour l'espèce " + specie.name + ' : ' + actions
        );
        return res.status(200).json({
            message: "Actions pour l'espèce " + specie.name + ' : ',
            actions
        });
    } catch (error) {
        return res.status(404).json({
            message:
                "Impossible de récupérer les actions de l'espèce :  " +
                specieId,
            error
        });
    }
};

const getActionsByAnimal = async (
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

        const actions = await Action.find({ animal: animalId }).exec();

        if (actions.length === 0) {
            Logging.info(
                NAMESPACE,
                "Aucune action pour l'individu : " + animal.name
            );
            return res.status(200).json({
                message: "Aucune action pour l'individu : " + animal.name
            });
        }

        Logging.info(
            NAMESPACE,
            "Actions pour l'individu " + animal.name + ' : ' + actions
        );
        return res.status(200).json({
            message: "Actions pour l'individu " + animal.name + ' : ',
            actions
        });
    } catch (error) {
        return res.status(404).json({
            message:
                "Impossible de récupérer les actions de l'individu :  " +
                animalId,
            error
        });
    }
};

const getNextAction = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const employeeId = req.params.employeeId;

        const action = await Action.findOne({
            createdBy: employeeId,
            status: 'Planifiée'
        })
            .sort({ plannedDate: 1 })
            .exec();

        if (!action) {
            return null;
        }

        return res.status(200).json({ action });
    } catch (error) {
        return res.status(404).json({
            message: 'impossible de récupérer la prochaine action',
            error
        });
    }
};

const updateAction = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const actionId = req.body._id;

    const actionUpdated = await Action.findOneAndUpdate(
        { _id: actionId },
        { status: 'Terminée' },
        { new: true }
    )
        .orFail()
        .exec();

    console.log('actionupdated : ' + actionUpdated);

    return res.status(200).json({ actionUpdated });
};

export default {
    createAction,
    getAllActions,
    getActionsByEmployee,
    getActionsByZone,
    getActionsByEnclosure,
    getActionsBySpecie,
    getActionsByAnimal,
    getNextAction,
    updateAction
};
