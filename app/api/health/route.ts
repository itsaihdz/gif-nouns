import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();
    
    // Basic health checks
    const healthChecks = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      version: process.env.npm_package_version || "1.0.0",
      checks: {
        api: "ok",
        database: "ok", // In real implementation, check DB connection
        storage: "ok",  // In real implementation, check storage access
        memory: "ok",   // In real implementation, check memory usage
      },
      metrics: {
        responseTime: 0,
        memoryUsage: process.memoryUsage(),
      },
    };

    // Simulate some checks
    const checks = await Promise.all([
      // Check API endpoints
      fetch(`${request.nextUrl.origin}/api/upload`).then(() => "ok").catch(() => "error"),
      // Check database (mock)
      Promise.resolve("ok"),
      // Check storage (mock)
      Promise.resolve("ok"),
    ]);

    healthChecks.checks.api = checks[0];
    healthChecks.checks.database = checks[1];
    healthChecks.checks.storage = checks[2];

    // Calculate response time
    healthChecks.metrics.responseTime = Date.now() - startTime;

    // Determine overall status
    const allChecksPassed = Object.values(healthChecks.checks).every(check => check === "ok");
    healthChecks.status = allChecksPassed ? "healthy" : "degraded";

    const statusCode = allChecksPassed ? 200 : 503;

    return NextResponse.json(healthChecks, { status: statusCode });

  } catch (error) {
    console.error("Health check error:", error);
    
    return NextResponse.json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: "Health check failed",
      details: error instanceof Error ? error.message : "Unknown error",
    }, { status: 503 });
  }
} 