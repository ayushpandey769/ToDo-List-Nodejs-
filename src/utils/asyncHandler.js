

const asyncHandler = (requestHandler) => {
    return (req , res , next) => {
        Promise.resolve(requestHandler(req , res , next))
        .catch((err) => next(err))
    }
}


export { asyncHandler }

// const asyncHandler = (fn) => (req, res, next) => {
//     Promise.resolve(fn(req, res, next)).catch(next);
// };
