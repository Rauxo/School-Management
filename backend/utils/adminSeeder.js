const User = require('../models/userModel');

const createDefaultAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            await User.create({
                name: 'Default Admin',
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
            });
            console.log('Default admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }
    } catch (error) {
        console.error(`Error creating default admin: ${error.message}`);
    }
};

module.exports = createDefaultAdmin;
