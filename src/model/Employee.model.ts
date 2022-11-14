import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import Employee from '../interface/employee.interface';

const EmployeeSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        firstName: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ['Soigneur', 'Responsable', 'Vétérinaire', 'Admin'],
            required: true
        },
        zone: {
            type: String,
            ref: 'Zone',

            enum: [
                'australie',
                'asie',
                'amerique-sud',
                'desert-afrique',
                'foret-amerique-nord',
                'pole-nord',
                'savane-afrique',
                'montagne-europe',
                'toutes'
            ],
            required: true
        }
    },
    { versionKey: false, timestamps: true }
);

// save a crypted password
EmployeeSchema.pre<Employee>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const hash = await bcrypt.hash(this.password, 10);

    this.password = hash;

    next();
});

// Verify if password is correct
EmployeeSchema.methods.isValidPassword = async function (
    password: string
): Promise<Error | boolean> {
    return bcrypt.compare(password, this.password);
};

export default model<Employee>('Employee', EmployeeSchema);
