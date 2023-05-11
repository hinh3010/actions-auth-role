import { type Request } from 'express'
export interface IError {
  status: number
  message: string
}

export interface ICustomRequest extends Request {
  user?: Record<string, any>
}
