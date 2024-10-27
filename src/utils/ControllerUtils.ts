export class ControllerUtils {
  static success(data: any) {
    return {
      ok: true,
      data
    };
  }

  static error(message: string) {
    return {
      ok: false,
      error: message
    };
  }
}
