const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

async function findOrCreateUser({ provider, providerId, email, name, avatar }) {
  let user = await User.findOne({ $or: [{ provider, providerId }, { email }] });
  if (user) {
    user.provider = provider;
    user.providerId = providerId;
    if (avatar) user.avatar = avatar;
    await user.save();
    return user;
  }
  const randomPassword = Math.random().toString(36).slice(-8);
  user = await User.create({ name, email, password: randomPassword, provider, providerId, avatar });
  return user;
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const avatar = profile.photos[0]?.value;
        const user = await findOrCreateUser({ provider: "google", providerId: profile.id, email, name, avatar });
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || `${profile.username}@users.noreply.github.com`;
        const name = profile.displayName || profile.username;
        const avatar = profile.photos?.[0]?.value;
        const user = await findOrCreateUser({ provider: "github", providerId: profile.id, email, name, avatar });
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
