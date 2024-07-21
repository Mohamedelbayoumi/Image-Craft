const Joi = require('joi')

const ApiError = require('../util/customError')

function validateImage(req, res, next) {

    const imageSchema = Joi.object({
        caterogy: Joi.string().min(2).max(8).required(),
        imageName: Joi.string().trim().required(),
        price: Joi.number().required(),
        description: Joi.string().required(),
        location: Joi.string().required()
    })

    const { error } = imageSchema.validate(req.body)

    if (error) {
        next(new ApiError(error, 422))
    }
    else {
        next()
    }

}

function validateUserLogin(req, res, next) {

    const loginSchema = Joi.object({

        email: Joi.string().email().trim().required(),

        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9@#$.!^&*-_]{5,30}$')).required()

    })

    const { error } = loginSchema.validate(req.body)

    if (error) {
        next(new ApiError(error, 422))
    }
    else {
        next()
    }
}

function validateUserRegister(req, res, next) {

    const registerSchema = Joi.object({

        userName: Joi.string().trim()
            .pattern(new RegExp('^[a-zA-Z0-9_.-]+$')).required(),

        phoneNumber: Joi.string().max(20).required(),

        email: Joi.string().email().trim().required(),

        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9@#$.!^&*-_]{5,30}$')).required()

    })

    const { error } = registerSchema.validate(req.body)

    if (error) {
        next(new ApiError(error, 422))
    }
    else {
        next()
    }

}
function validateNewPassword(req, res, next) {

    const resetSchema = Joi.object({

        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9@#$.!^&*-_]{5,30}$')).required(),

        confirmPassword: Joi.ref('password')

    })

    const { error } = resetSchema.validate(req.body)

    if (error) {
        next(new ApiError(error, 422))
    }
    else {
        next()
    }

}

module.exports = {
    validateImage,
    validateUserLogin,
    validateUserRegister,
    validateNewPassword
}
