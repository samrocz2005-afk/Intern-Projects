import { errorResponse } from "../utils/response.js";


const roleMiddleware = (...allowedRoles) => {

  return (req, res, next) => {

    try {

      if (!req.user) {

        return errorResponse(
          res,
          "Unauthorized",
          401
        );

      }



      const userRole =
        req.user.role?.toUpperCase();



      const roles =
        allowedRoles.map(
          (role) => role.toUpperCase()
        );



      console.log(
        "User Role:",
        userRole
      );

      console.log(
        "Allowed Roles:",
        roles
      );



      if (!roles.includes(userRole)) {

        return errorResponse(
          res,
          "Forbidden: Insufficient permissions",
          403
        );

      }



      next();


    } catch (error) {

      next(error);

    }

  };

};


export default roleMiddleware;