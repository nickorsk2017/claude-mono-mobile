export interface ServiceResponse<DataType> {
  success: boolean;
  data: DataType | null;
  error: string | null;
}

export function buildSuccessResponse<DataType>(data: DataType): ServiceResponse<DataType> {
  return { success: true, data, error: null };
}

export function buildErrorResponse(message: string): ServiceResponse<null> {
  return { success: false, data: null, error: message };
}
