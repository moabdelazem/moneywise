interface CacheEntry {
  analysis: string;
  timestamp: number;
}

interface CacheKey {
  userId: string;
  prompt: string;
  dataHash: string;
}

export class AnalysisCache {
  private cache: Map<string, CacheEntry>;
  private readonly TTL_MS = 1000 * 60 * 60; // 1 hour cache TTL

  constructor() {
    this.cache = new Map();
  }

  private generateKey(key: CacheKey): string {
    return `${key.userId}:${key.prompt}:${key.dataHash}`;
  }

  private generateDataHash(data: any): string {
    // Simple hash function for object comparison
    return JSON.stringify(data)
      .split("")
      .reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0)
      .toString(36);
  }

  async get(userId: string, prompt: string, data: any): Promise<string | null> {
    const key = this.generateKey({
      userId,
      prompt,
      dataHash: this.generateDataHash(data),
    });

    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.TTL_MS) {
      this.cache.delete(key);
      return null;
    }

    return entry.analysis;
  }

  async set(
    userId: string,
    prompt: string,
    data: any,
    analysis: string
  ): Promise<void> {
    const key = this.generateKey({
      userId,
      prompt,
      dataHash: this.generateDataHash(data),
    });

    this.cache.set(key, {
      analysis,
      timestamp: Date.now(),
    });

    // Cleanup old entries periodically
    if (this.cache.size > 1000) {
      this.cleanup();
    }
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.TTL_MS) {
        this.cache.delete(key);
      }
    }
  }
}
