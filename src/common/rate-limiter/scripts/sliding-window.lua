-- KEYS[1] = rate limit key
-- ARGV[1] = window duration in milliseconds
-- ARGV[2] = maximum allowed requests
-- ARGV[3] = unique request ID

local key = KEYS[1]
local window = tonumber(ARGV[1])
local limit = tonumber(ARGV[2])
local requestId = ARGV[3]

-- Get current time from Redis
local time = redis.call('TIME')
local now = (tonumber(time[1]) * 1000)
          + math.floor(tonumber(time[2]) / 1000)

-- Calculate the beginning of the sliding window
local windowStart = now - window

-- 1. Remove expired requests
redis.call(
    'ZREMRANGEBYSCORE',
    key,
    '-inf',
    windowStart
)

-- 2. Count requests inside the window
local requestCount = redis.call('ZCARD', key)

-- 3. Check whether the limit has been reached
if requestCount >= limit then

    -- Get the oldest request
    local oldest = redis.call(
        'ZRANGE', key, 0, 0, 'WITHSCORES'
    )

    -- Calculate when the oldest request expires
    local retryAfter = tonumber(oldest[2])
                    + window - now

    return {0, 0, retryAfter}
end

-- 4. Accept the request and store its timestamp
redis.call('ZADD', key, now, requestId)

-- 5. Set expiration to clean up unused keys
redis.call('PEXPIRE', key, window)

-- Return allowed, remaining requests, retryAfter
return {1, limit - requestCount - 1, 0}