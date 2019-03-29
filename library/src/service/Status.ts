export default class Status<T> {
    public readonly errorMessage: string | null;
    public readonly successful: boolean;
    public readonly payload: T | null;

    constructor(successful: boolean, errorMessage: string | null, payload: T | null = null) {
        this.errorMessage = errorMessage;
        this.successful = successful;
        this.payload = payload;
    }
}
