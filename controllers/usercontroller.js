const router = require('express').Router();
const User = require('../db').import('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const fetch = require('node-fetch');


/************************
 ** Create User Endpoint
 ************************/
router.post('/createuser', (req, res) => {
    let fullName = req.body.user.fullname;
    let email = req.body.user.email;
    let password = req.body.user.password;

    User.create({
        email: email,
        password: bcrypt.hashSync(password, 10),
        fullname: fullName
    })
        .then(
            createSuccess = user => {
                let token = jwt.sign({
                    id: user.id
                },
                    process.env.JWT_SECRET, {
                    expiresIn: 60 * 60 * 24
                });
                res.json({
                    user: user,
                    message: 'user created',
                    sessionToken: token
                });
            },
            createError = err => {
                res.send(500, err.message);
            }
        )
})

/************************
 ** User Sign In Endpoint
 ************************/
router.post('/signin', (req, res) => {
    User.findOne({
        where: {
            email: req.body.user.email
        }
    })
        .then(user => {
            if (user) {
                bcrypt.compare(req.body.user.password, user.password, (err, matches) => {
                    if (matches) {
                        let token = jwt.sign({
                            id: user.id
                        },
                            process.env.JWT_SECRET, {
                            expiresIn: 60 * 60 * 24
                        })
                        res.status(200).json({
                            user: user,
                            message: 'successful authentication',
                            sessionToken: token
                        })
                    } else {
                        res.status(502).send({ error: 'matches failure' })
                    }
                });
            } else {
                res.status(500).send({ error: 'just plain failed' })
            }
        }, err => res.status(501).send({ error: 'failed to prcess' })
        );
});

/************************
** GET All Users
************************/
router.get(['/', '/getall'], (req, res) => {
    User.findAll(
        // {
        //     attributes: ['id', 'fullname']
        // }
    )
        .then(user => res.status(200).json(user))
        .catch(err => res.status(500).json({ error: err }))
})

/************************
** GET One User by ID
************************/
router.get('/:id', (req, res) => {
    if (!isNaN(req.params.id)) {
        User.findOne({
            where: {
                id: req.params.id
            }
            // , attributes: ['fullname']
        })
            .then(user => res.status(200).json(user))
            .catch(err => res.status(500).json({ error: err }))
    } else {
        res.status(404).send('Page doesn\'t exist');
    }

})

/************************
** UPDATE One User by ID
************************/
router.put('/:id', (req, res) => {
    if (!isNaN(req.params.id)) {
        const userData = {
            fullname: req.body.user.fullname,
            email: req.body.user.email
        }
        User.update(userData, {
            where: {
                id: req.params.id
            }
        })
            .then(user => {
                res.status(200).json(user);
                console.log("Update Successful")
            })
            .catch(err => res.status(500).json({ error: err }))
    } else {
        res.status(404).send('Page doesn\'t exist');
    }

})

/*******************************************
 ** DELETE one user
 ** TODO: Need to lock this down
 *******************************************/
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(user => res.status(200).send('User Deleted'))
        .catch(err => res.status(500).json({ error: err }))
})

router.get('*', (req, res) => {
    res.send(404).send("Page doesn't exist.");
})
module.exports = router;