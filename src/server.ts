import express from 'express';
import imageRoutes from './presentation/routes/image.routes';
import 'dotenv/config';

const app = express();

app.use(express.json());
app.use('/images', imageRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
