import 'dotenv/config';
import 'reflect-metadata';
import express, { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { registerDependencies } from './config/container';
import { swaggerSpec } from './config/swagger';
import { environment } from './config/environment';
import authRouter from './interfaces/http/routes/auth.routes';
import { errorHandler } from './interfaces/http/middleware/errorHandler';
import { initializePrismaClient } from './shared/database/PrismaClient';

const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/auth', authRouter);

// Error handling middleware (must be last)
app.use(errorHandler);

async function bootstrap() {
  const prismaClient = await initializePrismaClient();
  registerDependencies(prismaClient);

  const port = environment.port;
  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
    console.log(`📚 Swagger documentation available at http://localhost:${port}/api-docs`);
    console.log(`❤️  Health check endpoint: http://localhost:${port}/health`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export default app;
