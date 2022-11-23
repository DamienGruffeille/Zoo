import Logging from '../library/logging';
import Animal from '../model/animal.model';
import ISpecie from '../interface/specie.interface';

const NAMESPACE = 'JSON CHECK';

export const areJSONDataOK = async (
    enclosureId: string,
    specieId: string,
    animalId: string
): Promise<boolean> => {
    Logging.info(NAMESPACE, 'Vérification des données du JSON');

    let result = false;

    const animal = await Animal.findById(animalId)
        .populate('specie')
        .select('specie')
        .exec();

    if (animal) {
        Logging.info(NAMESPACE, 'Animal : ' + animal + ' result: ' + result);

        const specie = animal.specie as ISpecie;
        const enclosure = specie.enclosure.toString();

        if (enclosureId === enclosure && specie._id === specieId) {
            Logging.info(
                NAMESPACE,
                'enclosureId : ' +
                    enclosureId +
                    ' / enclosure : ' +
                    enclosure +
                    ' result: ' +
                    result
            );
            result = true;
        }
    }

    Logging.info(NAMESPACE, 'Result : ' + result);

    return result;
};
