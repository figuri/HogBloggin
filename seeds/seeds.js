const data = require('./seeds.json');
const sequelize = require('../config/connection');
const { User, Post } = require('../models');

const seedDatabase = async () => {
    try {
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await sequelize.sync({ force: true });
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        await User.bulkCreate(data.users, {
            individualHooks: true,
            returning: true,
        });
        await Post.bulkCreate(data.posts, {
            individualHooks: true,
            returning: true,
        });
        process.exit(0);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

seedDatabase();