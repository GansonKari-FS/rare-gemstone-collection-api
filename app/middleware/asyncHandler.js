const asyncHandler = (fn) => {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (error) {
      console.error("Unhandled controller error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
    }
  };
};

module.exports = asyncHandler;
