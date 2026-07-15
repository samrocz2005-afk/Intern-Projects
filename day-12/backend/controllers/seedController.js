const seedService = require("../services/seedService");

const seedDatabase = async (req, res, next) => {
  try {
    const result = await seedService.seedDatabase();

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  seedDatabase,
};