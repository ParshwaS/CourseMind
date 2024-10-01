export class ExpressError extends Error {
	status: number;
	errObj: any;

	constructor(message: string, status: number, errObj?: any) {
		super(message);
		this.status = status;
		this.errObj = errObj;
	}

	toJSON() {
		if (process.env.NODE_ENV !== "production")
			return {
				success: false,
				message: this.message,
				errObj: this.errObj,
			};

		return {
			success: false,
			message: this.message,
		};
	}
}
