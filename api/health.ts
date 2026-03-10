interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  environment: string;
  services: {
    api: 'ok' | 'error';
    googleSheets: 'ok' | 'error';
  };
  errors?: string[];
  checks?: {
    name: string;
    status: 'pass' | 'fail';
    message: string;
  }[];
}

/**
 * Health Check API Endpoint
 * Gunakan untuk monitoring status aplikasi
 */
export default async function handler(
  request: { query: Record<string, string | string[]> },
  response: { status: (code: number) => { json: (data: HealthCheckResponse) => void } }
): Promise<void> {
  const startTime = Date.now();
  const checks: HealthCheckResponse['checks'] = [];
  const errors: string[] = [];
  let googleSheetsOk = true;

  // 1. Basic API check
  checks.push({
    name: 'API Server',
    status: 'pass',
    message: 'API endpoint is responding'
  });

  // 2. Google Sheets connectivity check
  const spreadsheetId = request.query.spreadsheetId as string;
  const sheetName = request.query.sheetName as string;

  if (spreadsheetId && sheetName) {
    try {
      const sheetsUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;

      // Use AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const sheetsResponse = await fetch(sheetsUrl, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (sheetsResponse.ok) {
        const data = await sheetsResponse.text();
        checks.push({
          name: 'Google Sheets Access',
          status: 'pass',
          message: `Spreadsheet accessible (${data.length} bytes)`
        });
      } else if (sheetsResponse.status === 404) {
        googleSheetsOk = false;
        errors.push('404: Spreadsheet not found or not publicly shared');
        checks.push({
          name: 'Google Sheets Access',
          status: 'fail',
          message: '404 - Spreadsheet not found or not publicly shared'
        });
      } else if (sheetsResponse.status === 403) {
        googleSheetsOk = false;
        errors.push('403: Permission denied - spreadsheet not publicly shared');
        checks.push({
          name: 'Google Sheets Access',
          status: 'fail',
          message: '403 - Permission denied'
        });
      } else {
        googleSheetsOk = false;
        errors.push(`HTTP ${sheetsResponse.status}: ${sheetsResponse.statusText}`);
        checks.push({
          name: 'Google Sheets Access',
          status: 'fail',
          message: `HTTP ${sheetsResponse.status}`
        });
      }
    } catch (error) {
      googleSheetsOk = false;
      const err = error instanceof Error ? error.message : String(error);
      errors.push(`Google Sheets check failed: ${err}`);
      checks.push({
        name: 'Google Sheets Access',
        status: 'fail',
        message: `Error: ${err}`
      });
    }
  } else {
    checks.push({
      name: 'Google Sheets Access',
      status: 'pass',
      message: 'Skipped (no spreadsheetId provided)'
    });
  }

  // Determine overall health status
  const elapsedTime = Date.now() - startTime;
  const allChecksPassed = checks.every((c) => c.status === 'pass');
  const healthStatus = allChecksPassed ? 'healthy' : errors.length > 0 ? 'degraded' : 'healthy';

  const result: HealthCheckResponse = {
    status: healthStatus,
    timestamp: new Date().toISOString(),
    environment: request.headers['x-forwarded-host'] || 'unknown',
    services: {
      api: 'ok',
      googleSheets: googleSheetsOk ? 'ok' : 'error'
    },
    ...(errors.length > 0 && { errors }),
    checks
  };

  // Add timing info
  (result as any).responseTime = `${elapsedTime}ms`;

  response.status(healthStatus === 'healthy' ? 200 : 503).json(result);
}
