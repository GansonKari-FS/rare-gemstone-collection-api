const asyncHandler = (fn) => {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  };
};

module.exports = asyncHandler;
