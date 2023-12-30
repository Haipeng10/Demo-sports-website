const statusCodes = require("http-status-codes");

// 404 - Not Found
exports.respondSourceNotFound = (req, res) => {
  let errorCode = statusCodes.NOT_FOUND;
  res.status(errorCode);
  res.render("errors/404");
};

// 500 - Internal Server Error
exports.respondInternalError = (error, req, res, next) => {
  let errorCode = statusCodes.INTERNAL_SERVER_ERROR;
  console.log(error);
  res.status(errorCode);
  res.render("errors/500");
  // next(error);
};