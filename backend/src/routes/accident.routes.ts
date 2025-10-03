import { Router } from 'express';
import { AccidentController } from '../controllers/accident.controller';
import { authenticateToken, requireCitizen } from '../middleware/auth';
import { apiRateLimit } from '../middleware/security';

const router = Router();

// Apply rate limiting to all accident routes
router.use(apiRateLimit);

// Public routes (for viewing accidents)
router.get('/', AccidentController.getAccidents);
router.get('/stats', AccidentController.getAccidentStats);
router.get('/:id', AccidentController.getAccidentById);

// Protected routes (require authentication)
router.use(authenticateToken as any);

// Citizen can report accidents
router.post('/', requireCitizen as any, AccidentController.createAccident);

// Update and delete require authentication
router.put('/:id', AccidentController.updateAccident);
router.delete('/:id', AccidentController.deleteAccident);

export default router;
