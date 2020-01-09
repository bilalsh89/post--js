const bcrypt= require('bcryptjs');
const jwt = require('jsonwebtoken');
const User= require ('../models/user');

exports.signup = (req, res, next) => {
  const userData = req.body;
  console.log(userData);
  const url = req.protocol + '://' + req.get('host');
  bcrypt.hash(userData.password, 10).then(
    (hash) => {
      const user = new User({
        image: url + '/images/' + req.file.filename, 
        lastName: userData.lastName,
        firstName: userData.firstName,
        email: userData.email,
        password: hash,
      });
      user.save().then(
        () => {
          const token = jwt.sign(
            { userId: user._id },
            'RANDOM_TOKEN_SECRET',
            { expiresIn: '24h' });
          res.status(200).json({
            userId: user._id,
            lastName: user.lastName,
            firstName: user.firstName,
            image: user.image,
            token: token
          });
        }
      ).catch(
        (error) => {
          res.status(500).json({
            error: error.message
          });
        }
      );
    }
  );
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }).then(
    (user) => {
      if (!user) {
        return res.status(401).json({
          error: new Error('User not found!')
        });
      }
      bcrypt.compare(req.body.password, user.password).then(
        (valid) => {
          if (!valid) {
            return res.status(401).json({
              error: new Error('Incorrect password!')
            });
          }
          const token = jwt.sign(
            { userId: user._id },
            'RANDOM_TOKEN_SECRET',
            { expiresIn: '24h' });
          res.status(200).json({
            userId: user._id,
            lastName: user.lastName,
            firstName: user.firstName,
            image: user.image,
            token: token
          });
        }
      ).catch(
        (error) => {
          res.status(500).json({
            error: error.message
          });
        }
      );
    }
  ).catch(
    (error) => {
      res.status(500).json({
        error: error.message
      });
    }
  );
}

exports.getUser = (req, res, next) => {
  User.findOne({_id: req.params.id}).then(
    (user) => {
      res.status(200).json(
        ...user
      );
    }
  );
}

exports.deleteUser = (req, res, next) => {
  User.findOne({_id: req.params.id}).then(
    (user) => {
      //const filename = user.imageUrl.split('/images/')[1];
      //fs.unlink('images/' + filename, () => {
        User.deleteOne({_id: req.params.id}).then(
          () => {
            res.status(200).json({
              message: 'Deleted!'
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error.message
            });
          }
        );
      //});
    }
  );
};