const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [
        2,
        "Name must be at least 2 characters",
      ],
      maxlength: [
        50,
        "Name cannot exceed 50 characters",
      ],
    },

    profileImage: {
      data: {
        type: Buffer,
        default: null,
      },

      contentType: {
        type: String,
        default: null,
      },
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [
        6,
        "Password must be at least 6 characters",
      ],
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    balance: {
      type: Number,
      default: 0,
      min: [
        0,
        "Balance cannot be negative",
      ],
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/*
|--------------------------------------------------------------------------
| Hash Password
|--------------------------------------------------------------------------
|
| IMPORTANT:
| This is async middleware.
| Do NOT use next().
|
*/

userSchema.pre(
  "save",
  async function () {
    // Password hasn't changed.
    if (!this.isModified("password")) {
      return;
    }

    const salt = await bcrypt.genSalt(12);

    this.password = await bcrypt.hash(
      this.password,
      salt
    );
  }
);

/*
|--------------------------------------------------------------------------
| Compare Password
|--------------------------------------------------------------------------
*/

userSchema.methods.comparePassword =
  async function (candidatePassword) {
    if (!this.password) {
      return false;
    }

    return bcrypt.compare(
      candidatePassword,
      this.password
    );
  };

/*
|--------------------------------------------------------------------------
| JSON Response
|--------------------------------------------------------------------------
*/

userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;
  delete user.__v;

  return user;
};

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

module.exports = mongoose.model(
  "User",
  userSchema
);