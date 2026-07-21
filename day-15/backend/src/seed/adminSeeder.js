import User from "../models/User.js";
import { hashPassword } from "../utils/password.js";

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    const hashedPassword = await hashPassword(
      process.env.ADMIN_PASSWORD
    );

    await User.create({
      username: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: process.env.ADMIN_ROLE,
    });

    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error seeding admin:", error.message);
  }
};

export default seedAdmin;