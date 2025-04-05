import * as admin from 'firebase-admin';
import * as path from 'path';
import 'dotenv/config';

if (!process.env.STORAGE_BUCKET) {
    throw new Error('STORAGE_BUCKET environment variable is not set');
}

const serviceAccount = require(path.join(__dirname, '../../firebase-adminsdk'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.STORAGE_BUCKET
});

const bucket = admin.storage().bucket();
const firestore = admin.firestore();

export { bucket, firestore };
