export class ServiceError extends Error {
  constructor(
    public message: string,
    public name: `${string}Err`,
  ) {
    super(message);
  }
}
