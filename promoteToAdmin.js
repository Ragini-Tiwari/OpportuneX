import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './backend/src/models/User.js';

dotenv.config({ path: './backend/.env' });

const promoteUser = async (email) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to Database');

        const user = await User.findOneAndUpdate(
            { email },
            { role: 'admin' },
            { new: true }
        );

        if (!user) {
            console.log('User not found!');
        } else {
            console.log(`Successfully promoted ${email} to admin!`);
            console.log(user);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

const email = process.argv[2];
if (!email) {
    console.log('Please provide an email: node promoteToAdmin.js user@example.com');
} else {
    promoteUser(email);
}
