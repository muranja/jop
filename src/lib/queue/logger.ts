import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

/**
 * Pushes game events to an asynchronous queue for processing.
 * This ensures the database writes don't block the real-time game loop.
 */
export async function logGameEvent(eventType: string, data: any) {
  const payload = {
    eventType,
    timestamp: new Date().toISOString(),
    data
  };

  try {
    await redis.lpush('game_audit_logs', JSON.stringify(payload));
    console.log(`[Queue] Logged ${eventType}`);
  } catch (error) {
    console.error(`[Queue Error] Failed to log ${eventType}:`, error);
    // In a production environment, you'd fallback to a local file log
  }
}

/**
 * Example of how to consume logs in a separate process:
 * 
 * async function processLogs() {
 *   while (true) {
 *     const log = await redis.brpop('game_audit_logs', 0);
 *     if (log) {
 *       const entry = JSON.parse(log[1]);
 *       // Write entry to PostgreSQL
 *     }
 *   }
 * }
 */
