const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const { Strategy: AnonymousStrategy } = require('passport-anonymous');
const jwt = require('jsonwebtoken');
const { Strategy: JwtStrategy } = require('passport-jwt');
const { ExtractJwt } = require('passport-jwt');
const RBACAuthorization = require('./RBACAuthorization');
const UserService = require('../services/userService');
const _ = require('lodash') ;

class Security {
  constructor(repository, jwtSecret) {
    this.repository = repository;
    this.rbacAuthorization = new RBACAuthorization(repository);
    this.jwtSecret = jwtSecret;
    this._setStrategies(); 
  }

  issueToken() {
    return [
      passport.authenticate("basic", {
        session: false,
      }),
      async (req, res) => {
        const { user } = req;

        const token = await jwt.sign(
          {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
          },
          this.jwtSecret
        );

        res.json({
          access_token: token,
          token_type: "bearer",
        });
      },
    ];
  }

  authenticate() {
    return [
      passport.authenticate(['jwt', 'anonymous'], {
        session: false,
      }), (req, res, next) => {
        if (!req.user) {
          req.user = {
            role: this.rbacAuthorization.getGuestAccessLevel().role,
          };
        }

        next();
      }];
  }

  authorise(controller, action) {
    return this.rbacAuthorization.authorize(controller, action);
  }

  hasAccess(role, controller, action, cb) {
    return this.rbacAuthorization.hasAccess(role, controller, action, cb);
  }

  canAny(role, permissions, cb) {
    return this.rbacAuthorization.canAny(role, permissions, cb);
  }


  _setStrategies() {
    passport.use(new AnonymousStrategy());

    passport.use(new BasicStrategy( async (userid, password, done) => {
      let user;
      try {
        if (_.isInteger(userid)) {
          user = await this.repository.user.find(userid); 
        } else if (UserService.isEmail(userid)) {
          user = await this.repository.user.getByEmail(userid); 
        } else {
          user = await this.repository.user.getByUsername(userid); 
        }
        
        if (!user || !UserService.checkPassword(user.hashed_password, user.salt_password, password)) {
          return done(null, false);
        }
        
        done(null, user);
      } catch (err) {
        done(err);
      }
    }));

    passport.use(
      new JwtStrategy(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: this.jwtSecret,
        },
        (user, done) => done(null, user)
      )
    );
  }
}

module.exports = Security;
