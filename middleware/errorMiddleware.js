const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode ? res.statusCode : 500;
    let message = err.message;

    // Check for Mongoose Cast Error (Invalid ID)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found';
    }

    // Check for Duplicate Key Error
    if (err.code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value entered';
    }

    // Check for Mongoose Validation Error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    // If status code is 200, force it to 500
    if (statusCode === 200) {
        statusCode = 500;
    }

    res.status(statusCode);

    res.json({
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = {
    errorHandler
};
