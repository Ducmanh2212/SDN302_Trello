const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/User");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Tìm kiếm người dùng theo googleId
      User.findOne({ googleId: profile.id }).then((existingUser) => {
        if (existingUser) {
          done(null, existingUser); // Nếu đã tồn tại, gọi done với user
        } else {
          // Nếu chưa tồn tại, tạo người dùng mới
          new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value, // Lấy email từ profile
            avatar: profile._json.picture, // Lấy ảnh đại diện từ profile
          })
            .save()
            .then((newUser) => {
              done(null, newUser);
            });
        }
      });
    }
  )
);
