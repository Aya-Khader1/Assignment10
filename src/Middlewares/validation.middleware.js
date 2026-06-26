import { BadRequestException } from "../Utils/response/error.response.js";





export const validation = (schema) => {
    return (req, res, next) => {
        const validationErrors = [];

        for (const key of Object.keys(schema)) {

            const validationResults = schema[key].validate(req[key], {
                abortEarly: false
            });

            if (validationResults.error) {
                validationErrors.push({
                    key,
                    details: validationResults.error.details
                });
            }
        }

        if (validationErrors.length) {
            throw BadRequestException("ValidationError", validationErrors);
        }

        return next();
    };
};