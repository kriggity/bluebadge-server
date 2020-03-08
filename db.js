const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.NAME, 'postgres', process.env.PASSWORD, {
    host: 'localhost',
    dialect: 'postgres'
});

sequelize.authenticate()
    .then(() => {
        console.log(`Connected to ${process.env.NAME} postgres DB`)
    },
        err => console.log(err)
    );

module.exports = sequelize;