import { MongoClient } from 'mongodb';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
try {
    await client.connect();
    const database = client.db();
    const email = 'local@openstock.local';
    if (await database.collection('user').findOne({ email })) {
        console.log('Existing local account preserved.');
    } else {
        const auth = betterAuth({
            database: mongodbAdapter(database),
            secret: process.env.BETTER_AUTH_SECRET,
            baseURL: process.env.BETTER_AUTH_URL,
            emailAndPassword: { enabled: true },
        });
        await auth.api.signUpEmail({
            body: { email, password: process.env.OPENSTOCK_LOCAL_PASSWORD, name: 'Local' },
        });
        console.log('Local account created; public signup remains disabled.');
    }
} finally {
    await client.close();
}
