import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from './config/config';
import { errorHandler } from './middlewares/error.middleware';
import healthRoutes from './routes/health';
import logger from './utils/logger';

const app = express();

app.use(helmet());
app.use(cors({
  origin: config.cors.origins,
  methods: config.cors.methods,
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(rateLimit(config.rateLimiter));

app.use(`${config.api.prefix}/health`, healthRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port} in ${config.env} mode`);
}); 