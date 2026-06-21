import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { users } from "../utils/constants.mjs";

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "my-secret-key"
};


passport.use(
    new JwtStrategy(options, (payload, done) => {
        try {
            const user = users.find(
                user => user.id === payload.id
            );

            if (user) {
                return done(null, user);
            }

            return done(null, false);
        }
        catch (error) {
            return done(error, false);
        }
    })
)