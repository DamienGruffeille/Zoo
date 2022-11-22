import Logging from '../library/logging';
import Employee from '../model/Employee.model';
import Enclosure from '../model/enclosure.model';

const NAMESPACE = 'Zone Auth';

export const isZoneAuthorized = async (
    username: string,
    enclosure: string
): Promise<boolean> => {
    Logging.info(NAMESPACE, 'Vérification de la zone');
    const employee = await Employee.findOne({ name: username })
        .select('zone')
        .exec();
    const _enclosure = await Enclosure.findById(enclosure)
        .select('zone')
        .exec();

    if (employee && _enclosure) {
        if (
            employee.zone.toString() === 'toutes' ||
            employee.zone === _enclosure.zone
        ) {
            Logging.info(
                NAMESPACE,
                "L'employé(e) est habilité(e) sur cette zone"
            );
            return true;
        } else {
            Logging.warn(
                NAMESPACE,
                "L'employé(e) n'est pas habilité(e) sur cette zone"
            );
            return false;
        }
    } else {
        Logging.error(
            NAMESPACE,
            "L'employé(e) ou l'enclos n'a pas été trouvé!"
        );
        return false;
    }
};
