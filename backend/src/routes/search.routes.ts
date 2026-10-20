import { Router } from 'express';
import { searchAll } from '../controllers/search.controller.js';

export const searchRouter = Router();

searchRouter.get('/', searchAll);
