# WEBS5 Hoorcollege week 5 demo: Authenticatie en Autorizatie
In deze demo gaan we gebruik maken PassportJS, JWT (Json Web Tokens) en Connect-Roles.<br />
Met deze modules gaan we kunnen inloggen en routes open- of dichtzetten op basis van onder andere je rol.

## Authenticatie
Om dingen te kunnen afschermen willen we eerst weten wie iemand is.<br />
Daarom maken we eerst de login functionaliteit.

1. Open _/config/auth-config.js_.
2. We gaan gebruik maken van passport en willen lokaal inloggen. Importeer daarom:
```javascript
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
```
3. Nu maken we een strategy aan die het mogelijk maakt je username / password mee te geven en die de juiste user dan op het request (voor in de route) zet:<br/>
Merk op dat we done aanroepen en dan de user óf false zetten. Dit staat gelijk aan ingelogd zijn of niet.
```javascript
passport.use('login', new LocalStrategy(function (username, password, done) {
    var user = users[_.findIndex(users, { name: username })];

    if (user && user.password === password) {
        done(null, user);
    } else {
        done(null, false);
    }
}));
``` 
4. We moeten de app nog laten weten dat we passport gebruiken _app.js_:
```javascript
app.use(require('passport').initialize());
```
5. Nu kunnen we dit gebruiken in de index route _/routes/index.route.js_. Require passport en gebruik de middleware in de route:
```javascript
var passport = require("passport");

...
router.post("/login", passport.authenticate('login', { session: false }), function(req, res){
	return res.json({ user: req.user });
});
```
5. Nu kunnen we posten naar http://localhost:3000/login en dan krijgen we de user terug met bijvoorbeeld:
```
username: jan
password: jantje
```
6. We hebben de user teruggegeven, maar we willen natuurlijk de token teruggeven zodat de client die elke keer mee kan sturen.<br/>
Nu kunnen we de login uitbreiden (en meteen maar ook even het password weghalen):
```javascript
var jwt = require('jsonwebtoken');
var secret = 'Hier komt jouw secret die niemand kent, die stop je dus niet in je public GIT code, maar in config of iets dergelijks';
...
var payload = { id: user.id, username: user.name };
var token = jwt.sign(payload, secret, { expiresIn: '24h'});

delete user.password;
user.token = token;
done(null, user);
```
7. Bewaar de token die je gekregen hebt (normaal in local storage o.i.d. in de client). Die ga je meegeven aan de overige requests.
8. Nu gaan we er voor zorgen dat users met JWT kunnen authenticeren, dit doen we dus weer in _/config/auth-config.js_ met de JWT strategy:<br />
We halen de token uit de header en we lezen de payload die we eerder hebben gegenereerd uit.
```javascript
var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
...
passport.use('jwt', new JwtStrategy({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: secret }, function(jwt_payload, next) {
  var user = users[_.findIndex(users, {id: jwt_payload.id})];
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
}));
```
9. Nu kan je in _/routes/user.route.js_ de middleware toevoegen om via een JWT header te laten authenticeren:<br/>
De user komt op het request te staan en wanneer je geen authenticatie meegeeft zal je deze resultaten niet terugkrijgen.
```javascript
var passport = require('passport');
...
router.get("/me", passport.authenticate('jwt', { session: false }), function (req, res) {
    res.json({ user: req.user });
});
```
10. Wanneer je het request uitvoert zal je zien dat je nu de juiste data terug krijgt.
11. Zo kan je ook de gehele route Illuminati ineenkeer afschermen, dit doe je in de _app.js_:
```javascript
var passport = require('passport');
...
app.use('/illuminati', passport.authenticate('jwt', { session: false }), require('./routes/illuminati.route')());
```