import { Router } from 'express';
import { getTasks, createTask, updateTask } from '../controllers/taskController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id', updateTask);

export default router;
