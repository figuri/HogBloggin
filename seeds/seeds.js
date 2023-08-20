const data = require('./seeds.json');
const sequelize = require('../config/connection');
const { User, Post } = require('../models');

const seedDatabase = async () => {
    try {
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await sequelize.sync({ force: true });
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        await User.create(data[0]);
        await User.create(data[1]);
        await User.create(data[2]);
        await Post.create(data[3]);
        await Post.create(data[4]);
        await Post.create(data[5]);
        await Post.create(data[6]);
        await Post.create(data[7]);
        await Post.create(data[8]);
        await Post.create(data[9]);
        await Post.create(data[10]);
        await Post.create(data[11]);
        await Post.create(data[12]);
        await Post.create(data[13]);
        await Post.create(data[14]);
    } catch (err) {
        console.log(err);
    }
    process.exit(0);
};

seedDatabase();