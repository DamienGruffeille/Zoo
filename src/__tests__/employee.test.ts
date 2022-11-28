import supertest from 'supertest';
import { closeDB, MongoConnect } from '../init/dataSource.init';
import Server from '../init/server.init';
import App from '../init/app.init';
import Logging from '../library/logging';

const NAMESPACE = 'EMPLOYEE TEST';
let app: any;

describe('employee', () => {
    beforeAll(() => {
        app = App.createApp();
        Server.ServerInit(app);
        Logging.info(NAMESPACE, 'Server initialized');
        MongoConnect();
        Logging.info(NAMESPACE, 'DB connection established');
    });
    afterAll(async () => {
        await Server.CloseServer();
        Logging.info(NAMESPACE, 'Server closed');
        closeDB();
        Logging.info(NAMESPACE, 'DB connection closed');
    });

    describe('post login route', () => {
        describe('given the employee does not exist', () => {
            it('should return a 404', async () => {
                const unknownUserPayLoad = {
                    email: 'test@example.com',
                    password: '123'
                };

                const { statusCode, body } = await supertest(app)
                    .post('/api/employes/login')
                    .send(unknownUserPayLoad);

                expect(statusCode).toBe(404);
                expect(body.message).toBe('Utilisateur non trouvé');
            });
        });

        describe('given the employee does exist', () => {
            describe('but password is incorrect', () => {
                it('should return a 401', async () => {
                    const userPayLoad = {
                        email: 'chantalgicque@zoo.fr',
                        password: 'passwor'
                    };

                    const { statusCode, body } = await supertest(app)
                        .post('/api/employes/login')
                        .send(userPayLoad);

                    expect(statusCode).toBe(401);
                    expect(body.message).toBe('Utilisateur non authentifié');
                });
            });

            describe('and password is correct', () => {
                it('should return a 200', async () => {
                    const userPayLoad = {
                        email: 'chantalgicque@zoo.fr',
                        password: 'password'
                    };

                    const { statusCode, body } = await supertest(app)
                        .post('/api/employes/login')
                        .send(userPayLoad);

                    expect(statusCode).toBe(200);
                    expect(body.message).toBe('Utilisateur authentifié');
                    expect(body.employee.email).toBe(userPayLoad.email);
                });
            });
        });
    });
});
