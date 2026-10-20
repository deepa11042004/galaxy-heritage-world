import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { destinationsRouter } from './destinations.routes.js';
import { packagesRouter } from './packages.routes.js';
import { hotelsRouter } from './hotels.routes.js';
import { itinerariesRouter } from './itineraries.routes.js';
import { activitiesRouter } from './activities.routes.js';
import { enquiriesRouter } from './enquiries.routes.js';
import { faqsRouter } from './faqs.routes.js';
import { searchRouter } from './search.routes.js';
import { settingsRouter } from './settings.routes.js';
import { testimonialsRouter } from './testimonials.routes.js';
import { mediaRouter } from './media.routes.js';
import { adminRouter } from './admin.routes.js';
import { prisma } from '../config/database.js';

export const apiRouter = Router();

// Health check endpoint
apiRouter.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'UP',
      service: 'Galaxy Heritage World API',
      timestamp: new Date().toISOString(),
      database: 'Connected',
    });
  } catch (error) {
    res.status(503).json({
      status: 'DOWN',
      service: 'Galaxy Heritage World API',
      timestamp: new Date().toISOString(),
      database: 'Disconnected',
      error: (error as Error).message,
    });
  }
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/destinations', destinationsRouter);
apiRouter.use('/packages', packagesRouter);
apiRouter.use('/hotels', hotelsRouter);
apiRouter.use('/itineraries', itinerariesRouter);
apiRouter.use('/activities', activitiesRouter);
apiRouter.use('/enquiries', enquiriesRouter);
apiRouter.use('/faqs', faqsRouter);
apiRouter.use('/search', searchRouter);
apiRouter.use('/settings', settingsRouter);
apiRouter.use('/testimonials', testimonialsRouter);
apiRouter.use('/media', mediaRouter);
apiRouter.use('/admin', adminRouter);
