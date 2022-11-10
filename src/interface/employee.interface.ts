import { Document } from 'mongoose';

export default interface IEmployee extends Document {
    name: string;
    firstName: string;
    email: string;
    password: string;
    role: string;

    isValidPassword(password: string): Promise<Error | boolean>;
}
