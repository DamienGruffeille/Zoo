import { Request, Response, NextFunction } from 'express';
import Logging from '../library/logging';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

const NAMESPACE = 'AUTH';

const extractJWT = (req: Request, res: Response, next: NextFunction) => {
    Logging.info(NAMESPACE, 'Validating Token');

    let token = req.headers.authorization?.split(' ')[1];

    if (token) {
        jwt.verify(token, config.jwt.secret, (error, decoded) => {
            if (error) {
                return res.status(404).json({ message: error.message, error });
            } else {
                res.locals.jwt = decoded;
                next();
            }
        });
    } else {
        return res.status(401).json({ message: 'Utilisateur non autorisé' });
    }
};

export default extractJWT;
