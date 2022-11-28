import supertest from 'supertest';
import { closeDB, MongoConnect } from '../init/dataSource.init';
import Server from '../init/server.init';
import App from '../init/app.init';
import Logging from '../library/logging';

const NAMESPACE = 'ANIMAL TEST';
let app: any;

describe('Animal', () => {
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
    describe('get Animal route', () => {
        describe('given the animal does not exist', () => {
            it('should return a 404', async () => {
                Logging.info(NAMESPACE, 'Animal not found');
                const animalId = 'toto';

                await supertest(app)
                    .get(`/api/animaux/get/${animalId}`)
                    .set(
                        'Authorization',
                        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6eyJ1c2VybmFtZSI6IkdpY3F1ZSIsInJvbGUiOiJWw6l0w6lyaW5haXJlIn0sImlhdCI6MTY2OTIxNjAxNH0.P4kyy1LetHb7oP9P56PDXGDs0yD-oz8pAMAyPPBhAvU'
                    )
                    .expect(404);
            });
        });

        describe('given the animal does exist', () => {
            it('should return a 200 status and an animal', async () => {
                Logging.info(NAMESPACE, 'Animal found');
                const animalId = 'uma';

                const { body, statusCode } = await supertest(app)
                    .get(`/api/animaux/get/${animalId}`)
                    .set(
                        'Authorization',
                        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6eyJ1c2VybmFtZSI6IkdpY3F1ZSIsInJvbGUiOiJWw6l0w6lyaW5haXJlIn0sImlhdCI6MTY2OTIxNjAxNH0.P4kyy1LetHb7oP9P56PDXGDs0yD-oz8pAMAyPPBhAvU'
                    );

                expect(statusCode).toBe(200);
                expect(body.message).toBe('Animal trouvé');
                expect(body.animal._id).toBe(animalId);
            });
        });
    });

    describe('heal animal route', () => {
        describe('given employee does not have rights to heal', () => {
            it('should return a 401 status', async () => {
                const animalPayload = {
                    _id: 'uma',
                    observations: []
                };

                const { body, statusCode } = await supertest(app)
                    .post('/api/animaux/soigner')
                    .set(
                        'Authorization',
                        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6eyJ1c2VybmFtZSI6IlN0YW50ZSIsInJvbGUiOiJTb2lnbmV1ciJ9LCJpYXQiOjE2Njk2MzgyNzF9.-00JWUFsg78OuatpESr38fyoHUTZs9P8eRnqJO3wIbM'
                    )
                    .send(animalPayload);

                expect(statusCode).toBe(401);
                expect(body.message).toBe('Utilisateur non autorisé');
            });
        });
    });
});
