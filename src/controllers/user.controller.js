import userModel from '../dao/models/user.model.js';

export const createUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const user = await userModel.create({ firstName, lastName, email, password });
        res.status(201).json({ user });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json({ users });
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getUserById = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error('Error getting user by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
