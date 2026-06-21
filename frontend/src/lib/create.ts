export const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const

export const STATUSES: { code: number; label: string }[] = [
  { code: 200, label: '200 OK' },
  { code: 201, label: '201 Created' },
  { code: 204, label: '204 No Content' },
  { code: 301, label: '301 Moved Permanently' },
  { code: 302, label: '302 Found' },
  { code: 304, label: '304 Not Modified' },
  { code: 400, label: '400 Bad Request' },
  { code: 401, label: '401 Unauthorized' },
  { code: 403, label: '403 Forbidden' },
  { code: 404, label: '404 Not Found' },
  { code: 405, label: '405 Method Not Allowed' },
  { code: 408, label: '408 Request Timeout' },
  { code: 409, label: '409 Conflict' },
  { code: 410, label: '410 Gone' },
  { code: 422, label: '422 Unprocessable Entity' },
  { code: 429, label: '429 Too Many Requests' },
  { code: 500, label: '500 Internal Server Error' },
  { code: 502, label: '502 Bad Gateway' },
  { code: 503, label: '503 Service Unavailable' },
  { code: 504, label: '504 Gateway Timeout' },
]
