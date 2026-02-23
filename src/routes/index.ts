import { Router } from 'express';
import { AuthHandler } from '../handlers/AuthHandler';
import { UserHandler } from '../handlers/UserHandler';
import { CarHandler } from '../handlers/CarHandler';
import { UnitHandler } from '../handlers/UnitHandler';
import { TechRequestHandler } from '../handlers/TechRequestHandler';
import { StatsHandler } from '../handlers/StatsHandler';
import { authenticate, checkAdmin } from '../middleware/auth';
import { upload } from '../utils/fileUpload';

const router = Router();

// Обработчики
const authHandler = new AuthHandler();
const userHandler = new UserHandler();
const carHandler = new CarHandler();
const unitHandler = new UnitHandler();
const techRequestHandler = new TechRequestHandler();
const statsHandler = new StatsHandler();

// Аутентификация
router.post('/auth/login', (req, res) => authHandler.login(req, res));
router.get('/auth/me', authenticate, (req, res) => authHandler.getMe(req, res));

// Пользователи (только admin)
router.get('/users', authenticate, checkAdmin, (req, res) => userHandler.getAll(req, res));
router.post('/users', authenticate, checkAdmin, (req, res) => userHandler.create(req, res));
router.put('/users/:login', authenticate, checkAdmin, (req, res) => userHandler.update(req, res));
router.delete('/users/:login', authenticate, checkAdmin, (req, res) => userHandler.delete(req, res));

// Автомобили
router.get('/cars', (req, res) => carHandler.getAll(req, res));
router.get('/cars/:car_id', authenticate, (req, res) => carHandler.getOne(req, res));
router.post('/cars', authenticate, upload.single('image'), (req, res) => carHandler.create(req, res));
router.put('/cars/:car_id', authenticate, upload.single('image'), (req, res) => carHandler.update(req, res));
router.delete('/cars/:car_id', authenticate, (req, res) => carHandler.delete(req, res));

// Узлы
router.get('/units/:unit_id', authenticate, (req, res) => unitHandler.getOne(req, res));
router.post('/units', authenticate, upload.single('image'), (req, res) => unitHandler.create(req, res));
router.put('/units/:unit_id', authenticate, upload.single('image'), (req, res) => unitHandler.update(req, res));
router.delete('/units/:unit_id', authenticate, (req, res) => unitHandler.delete(req, res));

// Заявки на ТО и ремонт
router.get('/tech-requests', authenticate, (req, res) => techRequestHandler.getAll(req, res));
router.get('/tech-requests/:request_id', authenticate, (req, res) => techRequestHandler.getOne(req, res));
router.post('/tech-requests', authenticate, (req, res) => techRequestHandler.create(req, res));
router.put('/tech-requests/:request_id', authenticate, (req, res) => techRequestHandler.update(req, res));
router.delete('/tech-requests/:request_id', authenticate, (req, res) => techRequestHandler.delete(req, res));

// Статистика
router.get('/stats', authenticate, (req, res) => statsHandler.getStats(req, res));

export default router;