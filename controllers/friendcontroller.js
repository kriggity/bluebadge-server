const router = require('express').Router();
const Friend = require('../db').import('../models/friend');
const User = require('../db').import('../models/user');

/*********************************************
** POST/CREATE new owner-friend relationship
*********************************************/
router.post('/create', (req, res) => {
    const friendData = {
        owner: req.user.id,
        friendid: req.body.friend.friendid
    }

    Friend.create(friendData)
        .then(friend => res.status(200).json(friend))
        .catch(err => res.json({ error: err }))
})

/*********************************************
** GET/READ all friends | Friends List
*********************************************/
router.get(['/', '/getall'], (req, res) => {
    User.hasMany(Friend);
    Friend.belongsTo(User, { foreignKey: 'friendid', targetKey: 'id' });
    Friend.findAll({
        attributes: ['id', 'owner', 'friendid'],
        where: { owner: req.user.id },
        include: [{
            model: User,
            attributes: ['id', 'fullname']
        }]
    })
        .then(friend => res.status(200).json(friend))
        .catch(err => res.status(500).json({ error: JSON.stringify(err, null, 2) }))
})

/*********************************************
** GET/READ one friend by id | Friend Profile
*********************************************/
router.get('/:id', (req, res) => {
    if (!isNaN(req.params.id)) {
        Friend.findOne({
            where: {
                owner: req.user.id
            }
        })
            .then(friend => res.status(200).json(friend))
            .catch(err => res.status(500).json({ error: err }))
    }
})

/*********************************************
** DELETE owner-friend relationship
*********************************************/
router.delete('/:id', (req, res) => {
    if (!isNaN(req.params.id)) {
        Friend.destroy({
            where: {
                owner: req.user.id,
                friendid: req.params.id
            }
        })
            .then(friend => res.status(200).json(friend))
            .catch(err => res.status(500).json({ error: err }))
    }
})

module.exports = router;