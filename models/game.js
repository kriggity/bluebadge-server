module.exports = (sequelize, DataTypes) => {
    return sequelize.define('game',{
        owner: DataTypes.INTEGER,
        gameId: DataTypes.STRING,
        comments: DataTypes.STRING,
        title: DataTypes.STRING,
        img: DataTypes.STRING
    })
}