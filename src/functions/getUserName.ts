import jwt from 'jsonwebtoken';
import Logging from '../library/logging';
import { config } from '../config/config';
import { IToken } from '../interface/token.interface';

const NAMESPACE = 'UserName';

export const getUserName = async (
    header: string,
    callback: (error: Error | null, username: string | null) => void
): Promise<void> => {
    Logging.info(NAMESPACE, 'Récupération du user name');

    try {
        let _token = header?.split(' ')[1];
        let username;

        jwt.verify(_token, config.jwt.secret, (error, decoded) => {
            if (error) {
                Logging.error(
                    NAMESPACE,
                    'Erreur lors de la vérification du token : ' + error
                );

                callback(error, null);
            } else if (decoded) {
                username = (decoded as IToken).UserInfo.username;
                Logging.info(NAMESPACE, 'UserName : ' + username);
                callback(null, username);
            }
        });
    } catch (error: any) {
        Logging.error(NAMESPACE, 'Erreur lors de la vérif du token ' + error);
        callback(error, null);
    }
};
