export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    retryAfter: number;
  }
  
  export interface RateLimitOptions {
    limit: number;
    windowMs: number;
  }
  