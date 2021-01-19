const {Sequelize} = require('sequelize');
const config = require('config');
const sequelize = new Sequelize(config.get('DB_URL'));

sequelize.authenticate()
    .then(() => {
        console.log(`Connected to postgres DB`)
    },
        err => console.log(err)
    );

module.exports = sequelize;
