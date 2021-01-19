const router = require('express').Router();
const Game = require('../db').import('../models/game');
const config = require('config');
const Request = require('request');

// Test Game root
// router.get(['/', '/home', '/getall'], (req, res) => {
//     res.send('game root');
// });

router.get('/mechanics/all', (req, res) => {
    
    let url = `https://www.boardgameatlas.com/api/game/mechanics?pretty=true&client_id=${config.get('BGA_CLIENT_ID')}`;
    let options = {
        'method': 'GET',
        'url': url,
        'headers': {
            'Content-Type': 'application/json'
        }
    }
    Request(options, (err, res) => {
        if (err) throw new Error(err);
        return res.body;
    })
})

/*******************************************
** POST/CREATE new owner-game relationship
*******************************************/
router.post('/create', (req, res) => {
    const gameData = {
        owner: req.user.id,
        gameId: req.body.game.gameId,
        comments: req.body.game.description,
        title: req.body.game.title,
        img: req.body.game.img
    }
    Game.create(gameData)
        .then(game => res.status(200).json(game))
        .catch(err => res.json({ error: err }))
})

/*******************************************
** GET/READ all owner-game relationships
*******************************************/
router.get('/user/:id', (req, res) => {
    if (!isNaN(req.params.id)) {
        Game.findAll({
            where: {
                owner: req.params.id
            }
        })
            .then(game => res.status(200).json(game))
            .catch(err => res.status(500).json({ error: err }))
    }
})
/*******************************************
 ** GET/READ one owner-game relationship
 *******************************************/
router.get('/:id', (req, res) => {
    if (!isNaN(req.params.id)) {
        Game.findOne({
            where: {
                id: req.params.id
            }
        })
            .then(game => res.status(200).json(game))
            .catch(err => res.status(500).json({ error: err }))
    }
})

/*******************************************
 ** UPDATE one owner-game relationship
 ** For now, this will only update game.comments
 *******************************************/
router.put('/:id', (req, res) => {
    if (!isNaN(req.params.id)) {
        const gameData = {
            comments: req.body.game.comments
        }
        Game.update(gameData, {
            where: {
                id: req.params.id
            }
        })
            .then(game => res.status(200).json(game))
            .catch(err => res.status(500).json({ error: err }))
    }
})

/*******************************************
** DELETE one owner-game relationship
*******************************************/
router.delete('/:id', (req, res) => {
    if (!isNaN(req.params.id)) {
        Game.destroy({
            where: {
                owner: req.user.id,
                id: req.params.id
            }
        })
            .then(game => res.status(200).send('Game Deleted'))
            .catch(err => res.status(500).json({ error: err }))
    }
})

/*******************************************
** DELETE all owner-game relationships
** Not currently in use. Future functionality
*******************************************/

module.exports = router;