function globalErrMiddleware(err, req, res, next) {
res.status(400).json({ errMsg: err.message, stack: err.stack, err });
}

export default globalErrMiddleware;