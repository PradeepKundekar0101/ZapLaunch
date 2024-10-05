class ApiError extends Error {
    statusCode:number;
    success:boolean
    errors: any;

    constructor(
        statusCode:number,
        message= "Something went wrong",
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.success = false;

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}