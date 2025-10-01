  const express = require("express");
  const customExpress = Object.create(express().response, {
    data: {
      value(data, message = "success", status = true) {
        return this.type("json").json({
          status,
          data,
          message,
        });
      },
    },
    error: {
      value(error, message = "An error occured", code) {
        return this.status(code || 500).json({
          message,
          statusCode: -3,
          status: false,
          error,
        });
      },
    },
    errorMessage: {
      value(message = "API response message", code) {
        return this.status(code || 400).json({
          message,
          statusCode: 1,
          status: false,
        });
      },
    },
  });

  module.exports = customExpress;
