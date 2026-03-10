import { FastifyReply } from 'fastify';

export type ApiErrorBody = {
  success: false;
  error: {
    code: string;
    message: string;
    status: number;
    details?: unknown;
  };
};

export class AppError extends Error {
  statusCode: number;
  code: string;
  details?: unknown;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export const codeFromStatus = (status: number): string => {
  if (status === 400) return 'BAD_REQUEST';
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status === 409) return 'CONFLICT';
  if (status === 422) return 'VALIDATION_ERROR';
  if (status >= 500) return 'INTERNAL_ERROR';
  return 'API_ERROR';
};

export const buildErrorBody = (
  status: number,
  message: string,
  code?: string,
  details?: unknown
): ApiErrorBody => {
  const body: ApiErrorBody = {
    success: false,
    error: {
      code: code ?? codeFromStatus(status),
      message,
      status,
    },
  };

  if (details !== undefined) {
    body.error.details = details;
  }

  return body;
};

export const sendError = (
  reply: FastifyReply,
  status: number,
  message: string,
  code?: string,
  details?: unknown
) => {
  return reply.status(status).send(buildErrorBody(status, message, code, details));
};
