const RBAC = require("rbac").default;

class RBACAuthorization {
  constructor(repository) {
    this.repository = repository;

    // Get roles in DB
    this.roles = {
      guest: "Guest",
      basic: "BasicUser",
      admin: "AdminUser",
      super: "SuperUser",
    };

    // Get levels in DB
    this.accessLevels = [
      {
        role: this.roles.guest,
        level: 10,
      },
      {
        role: this.roles.basic,
        level: 20,
      },
      {
        role: this.roles.admin,
        level: 30,
      },
      {
        role: this.roles.super,
        level: 40,
      },
    ];

    // Get ressources in DB

    // Implement RBAC
    this.rbac = new RBAC(
      {
        roles: this.accessLevels.map((al) => al.role),
        permissions: {
          IndexController: ["index"],
          UsersController: ["list", "create", "get", "getMe", "delete", "update", "updateMe"],
        },
        grants: {
          Guest: [
            "index_IndexController",
          ],
          BasicUser: [
            "Guest",

            // Me ressources
            "getMe_UsersController",
            "updateMe_UsersController",
          ],
          AdminUser: [
            // Heritage
            "BasicUser",

            // Users resources
            "list_UsersController",
            "get_UsersController",
            "create_UsersController",
            "delete_UsersController",
            "update_UsersController",
          ],
          SuperUser: [
            // Heritage
            "AdminUser",

            // Others ressources
            //'removeBook_BooksListController',
          ],
        },
      },
      (err) => {
        if (err) {
          throw err;
        }
      }
    );
  }

  getGuestAccessLevel() {
    return this.accessLevels.find((lvl) => lvl.role === this.roles.guest);
  }

  hasAccess(role, controller, action, cb) {
    this.rbac.can(role, action, controller, cb);
  }

  canAny(role, permissions, cb) {
    this.rbac.canAny(role, permissions, cb);
  }

  authorize(controller, action) {
    return (req, res, next) =>
      this.rbac.can(req.user.role, action, controller, (err, can) => {
        if (err) return next(err);
        if (!can) {
          const errorResponse = {
            error_description: {
              type: "access_denied",
              message: "Access denied",
            },
          };
          const accessLevel = this._minNeededAccessLevel(controller, action);

          if (accessLevel != null) {
            errorResponse.accessLevel = accessLevel;
          }

          return res.status(403).send(errorResponse);
        }

        next();
      });
  }

  _minNeededAccessLevel(controller, action) {
    const roles = this._whoCan(controller, action);
    const rolesAccessLevels = this.accessLevels
      .filter((al) => roles.includes(al.role))
      .map((al) => al.level);

    return rolesAccessLevels.length > 0 ? Math.min(...rolesAccessLevels) : null;
  }

  _whoCan(controller, action) {
    const rolesIncludePermission = [];
    this.rbac.getRoles((err, roles) => {
      if (err) throw err;

      roles.forEach((role) => {
        role.can(action, controller, (err2, can) => {
          if (err2) throw err2;

          if (can) {
            rolesIncludePermission.push(role.name);
          }
        });
      });
    });

    return rolesIncludePermission;
  }
}

module.exports = RBACAuthorization;
