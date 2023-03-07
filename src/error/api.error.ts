interface IApiError {
  code: string | number;
  message: string;
}

class ApiError implements IApiError {
  public code;

  public message;

  constructor(code, message) {
    this.code = code;
    this.message = message;
  }

  static badRequest(msg: string) {
    return new ApiError(400, msg);
  }

  static intervalServerError(msg: string) {
    return new ApiError(500, msg);
  }

  static notFoundError(msg: string) {
    return new ApiError(404, msg);
  }
}
export default ApiError;
