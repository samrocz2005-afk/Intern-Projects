const authService = require("../services/auth.service");

const {
  successResponse,
  createdResponse,
} = require("../utils/apiResponse");

/*
|--------------------------------------------------------------------------
| Profile Image URL
|--------------------------------------------------------------------------
|
| Keep frontend compatible.
|
| MongoDB stores:
|
| profileImage: {
|   data: Buffer,
|   contentType: String,
|   originalName: String
| }
|
| API returns:
|
| profileImage: "/api/auth/profile-image"
|
|--------------------------------------------------------------------------
*/

const PROFILE_IMAGE_URL = "/api/auth/profile-image";

/*
|--------------------------------------------------------------------------
| Convert User For API Response
|--------------------------------------------------------------------------
|
| IMPORTANT:
| Never send MongoDB Buffer to frontend.
|
|--------------------------------------------------------------------------
*/

const formatUserResponse = (user) => {
  if (!user) {
    return user;
  }

  const responseUser =
    typeof user.toObject === "function"
      ? user.toObject()
      : { ...user };

  /*
  |--------------------------------------------------------------------------
  | Convert MongoDB Buffer object to URL
  |--------------------------------------------------------------------------
  */

  if (
    responseUser.profileImage &&
    responseUser.profileImage.data
  ) {
    responseUser.profileImage =
      PROFILE_IMAGE_URL;
  } else {
    responseUser.profileImage = null;
  }

  return responseUser;
};

/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
*/

const register = async (req, res, next) => {
  try {
    const result =
      await authService.registerUser(
        req.body
      );

    return createdResponse(
      res,
      {
        ...result,
        user: formatUserResponse(
          result.user
        ),
      },
      "Account created successfully"
    );
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

const login = async (req, res, next) => {
  try {
    console.log("Login request:", {
      email: req.body?.email,
    });

    const result =
      await authService.loginUser(
        req.body
      );

    console.log(
      "Login successful:",
      result.user.email
    );

    return successResponse(
      res,
      {
        ...result,
        user: formatUserResponse(
          result.user
        ),
      },
      "Login successful"
    );
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Current User
|--------------------------------------------------------------------------
*/

const getMe = async (req, res, next) => {
  try {
    const user =
      await authService.getCurrentUser(
        req.user._id
      );

    return successResponse(
      res,
      formatUserResponse(user),
      "User profile retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

const changePassword = async (
  req,
  res,
  next
) => {
  try {
    await authService.changePassword(
      req.user._id,
      req.body
    );

    return successResponse(
      res,
      null,
      "Password changed successfully"
    );
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Update Profile
|--------------------------------------------------------------------------
*/

const updateProfile = async (
  req,
  res,
  next
) => {
  try {
    const user =
      await authService.updateUserProfile(
        req.user._id,
        req.body
      );

    return successResponse(
      res,
      formatUserResponse(user),
      "Profile updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Upload Profile Image - MongoDB Buffer
|--------------------------------------------------------------------------
|
| Flow:
|
| Frontend
|    ↓
| FormData
|    ↓
| Multer memoryStorage()
|    ↓
| req.file.buffer
|    ↓
| authService.updateProfileImage()
|    ↓
| MongoDB User.profileImage
|    ├── data
|    ├── contentType
|    └── originalName
|
|--------------------------------------------------------------------------
*/

const uploadProfileImage = async (
  req,
  res,
  next
) => {
  try {
    console.log(
      "Uploaded file:",
      req.file
        ? {
            fieldname:
              req.file.fieldname,

            originalname:
              req.file.originalname,

            mimetype:
              req.file.mimetype,

            size:
              req.file.size,

            hasBuffer:
              Boolean(
                req.file.buffer
              ),
          }
        : null
    );

    /*
    |--------------------------------------------------------------------------
    | Validate File
    |--------------------------------------------------------------------------
    */

    if (!req.file) {
      const error = new Error(
        "Profile image is required"
      );

      error.statusCode = 400;

      throw error;
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Buffer
    |--------------------------------------------------------------------------
    */

    if (!req.file.buffer) {
      const error = new Error(
        "Uploaded image buffer is missing"
      );

      error.statusCode = 400;

      throw error;
    }

    /*
    |--------------------------------------------------------------------------
    | Save Buffer To MongoDB
    |--------------------------------------------------------------------------
    */

    const user =
      await authService.updateProfileImage(
        req.user._id,
        req.file
      );

    /*
    |--------------------------------------------------------------------------
    | Format Response
    |--------------------------------------------------------------------------
    |
    | DO NOT send:
    |
    | profileImage.data
    |
    | Instead return:
    |
    | /api/auth/profile-image
    |
    |--------------------------------------------------------------------------
    */

    const responseUser =
      formatUserResponse(user);

    return successResponse(
      res,
      {
        user: responseUser,

        profileImage:
          responseUser.profileImage,
      },
      "Profile image uploaded successfully"
    );
  } catch (error) {
    console.error(
      "Profile image upload controller error:",
      error
    );

    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Profile Image From MongoDB Buffer
|--------------------------------------------------------------------------
|
| GET:
|
| /api/auth/profile-image
|
| MongoDB:
|
| User.profileImage.data
|
| ↓
|
| HTTP image response
|
|--------------------------------------------------------------------------
*/

const getProfileImage = async (
  req,
  res,
  next
) => {
  try {
    /*
    |--------------------------------------------------------------------------
    | Find User
    |--------------------------------------------------------------------------
    */

    const user =
      await authService.getCurrentUser(
        req.user._id
      );

    /*
    |--------------------------------------------------------------------------
    | Check Profile Image
    |--------------------------------------------------------------------------
    */

    if (
      !user.profileImage ||
      !user.profileImage.data
    ) {
      const error = new Error(
        "Profile image not found"
      );

      error.statusCode = 404;

      throw error;
    }

    /*
    |--------------------------------------------------------------------------
    | Content Type
    |--------------------------------------------------------------------------
    */

    res.set(
      "Content-Type",
      user.profileImage.contentType ||
        "application/octet-stream"
    );

    /*
    |--------------------------------------------------------------------------
    | Content Length
    |--------------------------------------------------------------------------
    */

    res.set(
      "Content-Length",
      String(
        user.profileImage.data.length
      )
    );

    /*
    |--------------------------------------------------------------------------
    | Cache
    |--------------------------------------------------------------------------
    */

    res.set(
      "Cache-Control",
      "private, max-age=3600"
    );

    /*
    |--------------------------------------------------------------------------
    | Send MongoDB Buffer
    |--------------------------------------------------------------------------
    */

    return res.send(
      user.profileImage.data
    );
  } catch (error) {
    console.error(
      "MongoDB Buffer profile image error:",
      error
    );

    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

const logout = async (
  req,
  res,
  next
) => {
  try {
    return successResponse(
      res,
      null,
      "Logout successful"
    );
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

module.exports = {
  register,
  login,
  getMe,
  changePassword,
  updateProfile,
  uploadProfileImage,
  getProfileImage,
  logout,
};