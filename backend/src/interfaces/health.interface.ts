export interface SystemHealth {
  status: 'UP' | 'DOWN' | 'DEGRADED';
  version: string;
  timestamp: string;
  uptime: number;
  process: {
    pid: number;
    memory: {
      used: number;
      total: number;
      free: number;
      heapTotal: number;
      heapUsed: number;
      external: number;
      percentage: number;
    };
    cpu: {
      system: number;
      user: number;
      total: number;
      percentage: number;
    };
  };
  system: {
    platform: string;
    arch: string;
    cpus: {
      model: string;
      speed: number;
      cores: number;
      loadAvg: number[];
    };
    memory: {
      total: number;
      free: number;
      used: number;
      percentage: number;
    };
  };
} 