import { Router } from 'express';

import { generate } from '../../controllers/caricature/generate';
import { diskUploader, uploadToMemory } from '../../middleware';

const router = Router();

router.post('/generate', diskUploader.single('photo'), generate);

export default router;
