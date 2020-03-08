module.exports = (sequelize, DataTypes) => {
    return sequelize.define('friend', {
        owner: DataTypes.INTEGER,
        friendid: DataTypes.INTEGER
    })
}