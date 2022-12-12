import express from 'express';
import controller from '../controllers/species.controller';
import extractJWT from '../middleware/extractJWT';
import validationMiddleware from '../middleware/validation.middleware';
import validate from '../validation/specie.validation';

const router = express.Router();

router.post(
    '/create',
    extractJWT('Vétérinaire', 'Admin'),
    validationMiddleware(validate.register),
    controller.createSpecie
);

router.get(
    '/get/:specieId',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.getSpecie
);

router.get(
    '/get/enclos/:enclos',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.getSpecieByEnclosure
);

router.get(
    '/get/zone/:zone',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.getSpeciesByZone
);

router.get(
    '/get',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    controller.getAllSpecies
);
router.put(
    '/update/:specieId',
    extractJWT('Responsable', 'Vétérinaire', 'Admin'),
    controller.updateSpecie
);
router.delete(
    '/delete/:specieId',
    extractJWT('Vétérinaire', 'Admin'),
    controller.deleteSpecie
);
router.put(
    '/sortir',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    validationMiddleware(validate.sortir),
    controller.takeSpecieOutside
);
router.put(
    '/rentrer',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    validationMiddleware(validate.rentrer),
    controller.takeSpecieInside
);
/**
 * @openapi
 * '/api/especes/nourrir':
 *  put:
 *     tags:
 *     - Especes
 *     summary: feed a specy
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/feedSpecieSchema'
 *     responses:
 *      202:
 *        description: Animals fed
 *        content:
 *          application/json:
 *              $ref: '#/components/schemas/SpecieSchema'
 *      401:
 *        description: Unable to find Username
 *      404:
 *        description: Employee not authorized in the zone's enclosure
 *      500:
 *        description: Error occurred
 */
router.put(
    '/nourrir',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    validationMiddleware(validate.feed),
    controller.feedSpecie
);
router.put(
    '/stimuler',
    extractJWT('Soigneur', 'Responsable', 'Vétérinaire', 'Admin'),
    validationMiddleware(validate.stimulate),
    controller.stimulateSpecie
);

export = router;
