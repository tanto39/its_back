import express from 'express';
import cors from 'cors';
import passport from 'passport';
import path from 'path';
import routes from './routes';
import './middleware/auth'; // инициализация passport

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Статика для загруженных изображений
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Подключаем маршруты
app.use('/api', routes);

export default app;