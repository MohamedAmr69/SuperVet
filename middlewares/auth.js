const Auth = (req, res, next) => {
  const username = req.session.username;
  if (!username && req.url !== "/login" && req.url !== "/register")
    return res.redirect("/login");
  if (username === 'admin')
    return res.redirect("/adminHome")
  if (username && (req.url === "/login" || req.url === "/register"))
    return res.redirect("/");

  next();
};

const adminAuth = (req, res, next) => {
  const username = req.session.username;
  if (!username && req.url !== "/login" && req.url !== "/register")
    return res.redirect("/login");
  if (username !== 'admin')
    return res.redirect("/")
  if (username === 'admin' && (req.url === "/login" || req.url === "/register"))
    return res.redirect("/adminHome");

  next();
};


module.exports = {Auth, adminAuth};
