import os from 'os';
import { SystemHealth } from '../interfaces/health.interface';
import { readFileSync } from 'fs';
import { join } from 'path';

export class HealthService {
  private startTime: number;
  private readonly version: string;

  constructor() {
    this.startTime = Date.now();
    this.version = this.getPackageVersion();
  }

  private getPackageVersion(): string {
    try {
      const packageJson = JSON.parse(
        readFileSync(join(__dirname, '../../package.json'), 'utf8')
      );
      return packageJson.version;
    } catch {
      return '1.0.0';
    }
  }

  private calculateCpuUsage(): { system: number; user: number; total: number; percentage: number } {
    const cpus = os.cpus();
    const cpu = cpus[0];
    const total = Object.values(cpu.times).reduce((acc, tv) => acc + tv, 0);
    const system = cpu.times.sys / total * 100;
    const user = cpu.times.user / total * 100;

    return {
      system,
      user,
      total: system + user,
      percentage: process.cpuUsage().system / 1000000
    };
  }

  public async getHealth(): Promise<SystemHealth> {
    const processMemory = process.memoryUsage();
    const systemMemory = {
      total: os.totalmem(),
      free: os.freemem(),
      used: os.totalmem() - os.freemem(),
      percentage: ((os.totalmem() - os.freemem()) / os.totalmem()) * 100
    };

    const cpuInfo = os.cpus()[0];
    const processMemoryPercentage = (processMemory.heapUsed / processMemory.heapTotal) * 100;

    const health: SystemHealth = {
      status: processMemoryPercentage > 90 || systemMemory.percentage > 90 ? 'DEGRADED' : 'UP',
      version: this.version,
      timestamp: new Date().toISOString(),
      uptime: (Date.now() - this.startTime) / 1000,
      process: {
        pid: process.pid,
        memory: {
          used: processMemory.heapUsed,
          total: processMemory.heapTotal,
          free: processMemory.heapTotal - processMemory.heapUsed,
          heapTotal: processMemory.heapTotal,
          heapUsed: processMemory.heapUsed,
          external: processMemory.external,
          percentage: processMemoryPercentage
        },
        cpu: this.calculateCpuUsage()
      },
      system: {
        platform: process.platform,
        arch: process.arch,
        cpus: {
          model: cpuInfo.model,
          speed: cpuInfo.speed,
          cores: os.cpus().length,
          loadAvg: os.loadavg()
        },
        memory: systemMemory
      }
    };

    return health;
  }
} 