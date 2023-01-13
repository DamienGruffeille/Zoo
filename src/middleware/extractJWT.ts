import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Logging from '../library/logging';
import { config } from '../config/config';

const NAMESPACE = 'AUTH';

const extractJWT = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Logging.info(NAMESPACE, 'Validating Token');

        /** Je récupère le token dans le header de la requête */
        /** Le token se trouve dans authorization, après Bearer  */
        let token = req.headers.authorization?.split(' ')[1];

        /** Je récupère les roles autorisés dans le spread */
        const roles = [...allowedRoles];
        Logging.info(NAMESPACE, 'Roles autorisés : ' + roles);

        /** S'il y a un token... */
        if (token) {
            Logging.info(NAMESPACE, 'Vérification du token : ' + token);
            /** Je vérifie son intégrité grâce au secret */
            jwt.verify(token, config.jwt.secret, async (error, decoded) => {
                if (error) {
                    Logging.error(NAMESPACE, 'Token non valide');
                    return res
                        .status(404)
                        .json({ message: error.message, error });
                } else {
                    /** Si le token est valide, je récupère les infos */
                    /** du Payload déchiffrées */
                    res.locals.jwt = decoded;
                    Logging.info(
                        NAMESPACE,
                        'User Name : ' +
                            res.locals.jwt.UserInfo.username +
                            ' / role : ' +
                            res.locals.jwt.UserInfo.role
                    );
                    /** Je vérifie si le rôle du user est inclus dans les */
                    /** rôles autorisés */
                    const result = await roles.includes(
                        res.locals.jwt.UserInfo.role
                    );

                    if (!result) {
                        Logging.info(
                            NAMESPACE,
                            'Utilisateur non autorisé, roles autorisés : ' +
                                roles +
                                ' / role utilisateur : ' +
                                res.locals.jwt.UserInfo.role
                        );
                        return res
                            .status(401)
                            .json({ message: 'Utilisateur non autorisé' });
                    } else {
                        Logging.info(
                            NAMESPACE,
                            'Utilisateur autorisé, roles autorisés : ' +
                                roles +
                                ' / role utilisateur : ' +
                                res.locals.jwt.UserInfo.role
                        );
                        next();
                    }
                }
            });
        } else {
            return res
                .status(401)
                .json({ message: 'Utilisateur non autorisé' });
        }
    };
};

export default extractJWT;
