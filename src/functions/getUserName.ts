import jwt from 'jsonwebtoken';
import Logging from '../library/logging';
import { config } from '../config/config';
import { IToken } from '../interface/token.interface';

const NAMESPACE = 'UserName';

export const getUserName = async (token: string): Promise<any> => {
    let _token = token?.split(' ')[1];
    let username;

    Logging.info(NAMESPACE, 'Récupération du user name');

    jwt.verify(_token, config.jwt.secret, async (error, decoded) => {
        if (error) {
            Logging.error(
                NAMESPACE,
                'Erreur lors de la vérification du token : ' + error
            );
        } else {
            username = (decoded as IToken).UserInfo.username;
            Logging.info(NAMESPACE, 'UserName : ' + username);
            // return username;
        }
    });
    return username;
};
