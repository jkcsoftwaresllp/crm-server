export function formatResponse(data = null, message = '', status = 200, pagination = null) {
  const success = status >= 200 && status < 300;

  const response = {
    success,
    data: success ? data : null,
    message,
    status,
    timestamp: new Date().toISOString(),
  };

  if (!success) {
    response.error = data || null;
  }

  if (pagination) {
    response.pagination = pagination;
  }

  return response;
}
