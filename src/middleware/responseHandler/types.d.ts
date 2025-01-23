import { Response as ExpressResponse } from "express";

export interface ResponseData {
  success: boolean;
  data?: any;
  message?: string;
  error?: {
    type: string;
    message: string;
  };
  statusCode?: number;
}

export interface Response extends ExpressResponse {
  data?: any;
  message?: string;
  statusCode?: number;
}
