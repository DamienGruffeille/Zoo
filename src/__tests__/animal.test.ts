import supertest from 'supertest';
import { closeDB, MongoConnect } from '../init/dataSource.init';
import Server from '../init/server.init';
import App from '../init/app.init';

let app: any;

beforeAll(async () => {
    app = App.createApp();
    Server.ServerInit(app);
    MongoConnect();
});

afterAll(() => {
    Server.CloseServer();
    closeDB();
});

describe('Animal', () => {
    describe('get Animal route', () => {
        describe('given the animal does not exist', () => {
            it('should return a 404', async () => {
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
    });
});
