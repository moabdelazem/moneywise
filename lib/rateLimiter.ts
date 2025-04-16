interface RateLimit {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private limits: Map<string, RateLimit>;
  private requestsPerWindow: number;
  private windowSeconds: number;

  constructor(requestsPerWindow: number, windowSeconds: number) {
    this.limits = new Map();
    this.requestsPerWindow = requestsPerWindow;
    this.windowSeconds = windowSeconds;
  }

  tryAcquire(userId: string): boolean {
    const now = Date.now();
    const userLimit = this.limits.get(userId);

    // Clean up expired entries
    if (userLimit && userLimit.resetTime <= now) {
      this.limits.delete(userId);
    }

    // If no existing limit, create new one
    if (!this.limits.has(userId)) {
      this.limits.set(userId, {
        count: 1,
        resetTime: now + this.windowSeconds * 1000,
      });
      return true;
    }

    // Check existing limit
    const limit = this.limits.get(userId)!;
    if (limit.count >= this.requestsPerWindow) {
      return false;
    }

    // Increment counter
    limit.count++;
    return true;
  }
}
