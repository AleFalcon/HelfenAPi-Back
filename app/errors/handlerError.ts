import HttpStatus from 'http-status-codes';

export class HandlerError extends Error {
    errorCode: number;

    getMessage(): string {
      return this.message;
    }

    gerErrorCode(): number {
        return this.errorCode;
    }

    
    constructor(message: string, errorCode: number) {
        super();
        this.message = this.defineErrorCode(errorCode) + message;
        this.errorCode = errorCode;
        return this;
    }
    
    defineErrorCode(errorCode: number): string {
        switch (errorCode) {
            case HttpStatus.NOT_ACCEPTABLE:
                return HttpStatus.NOT_ACCEPTABLE.toString() + " Not Acceptable. ";
            
            case HttpStatus.INTERNAL_SERVER_ERROR:
                return HttpStatus.INTERNAL_SERVER_ERROR.toString() + " Internal Server Error. ";

            case HttpStatus.NOT_FOUND:
                return HttpStatus.NOT_FOUND.toString() + " Not Found Error. ";
            
            case HttpStatus.BAD_REQUEST:
                return HttpStatus.BAD_REQUEST.toString() + " Bad Request Error. ";
            
            default:
                return "Error code not identified";
        }
    }

}
