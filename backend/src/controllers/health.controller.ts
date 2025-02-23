import { Request, Response, NextFunction } from 'express';
import { HealthService } from '../services/health.service';
import { BaseResponse } from '../interfaces/http.interface';
import { SystemHealth } from '../interfaces/health.interface';
import logger from '../utils/logger';

export class HealthController {
  private healthService: HealthService;

  constructor() {
    this.healthService = new HealthService();
  }

  public getHealth = async (
    req: Request,
    res: Response<BaseResponse<SystemHealth>>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const health = await this.healthService.getHealth();
      
      if (health.status !== 'UP') {
        logger.warn('System health check indicates degraded performance', health);
      }

      res.status(health.status === 'UP' ? 200 : 503).json({
        success: true,
        data: health,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  };
} 