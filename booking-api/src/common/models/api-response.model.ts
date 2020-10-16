interface IApiResponse<T> {
  success: boolean;
  result?: T;
  message?: string;
}

export class ApiResponse<T = any> {
  private success: boolean;
  private result?: T;
  private message?: string;
  private constructor(data: IApiResponse<T>) {
    this.success = data.success;
    if (data.result) {
      this.result = data.result;
    }
    if (data.message) {
      this.message = data.message;
    }
  }

  static success<T>(result: T, message: string = '') {
    return new ApiResponse({ success: true, result, message });
  }

  static error<T>(message: string, result: T = null) {
    return new ApiResponse({ success: false, result, message });
  }
}
