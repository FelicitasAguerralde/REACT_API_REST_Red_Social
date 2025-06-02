const Follow = require("../models/follow");
const mongoose = require('mongoose');

const followUserIds = async (identityUserId) => {
    try {
        // Validar que el ID sea válido
        if (!mongoose.Types.ObjectId.isValid(identityUserId)) {
            throw new Error('ID de usuario inválido');
        }

        // Sacar info seguimiento
        let following = await Follow.find({ "user": identityUserId })
            .select({ "followed": 1, "_id": 0 })
            .exec();

        let followers = await Follow.find({ "followed": identityUserId })
            .select({ "user": 1, "_id": 0 })
            .exec();

        // Procesar array de identificadores
        let followingClean = following
            .map(follow => follow.followed)
            .filter(id => id != null);

        let followersClean = followers
            .map(follow => follow.user)
            .filter(id => id != null);

        return {
            following: followingClean,
            followers: followersClean
        }

    } catch (error) {
        console.error("Error en followUserIds:", error);
        return {
            following: [],
            followers: []
        };
    }
}

const followThisUser = async (identityUserId, profileUserId) => {
    try {
        // Validar que los IDs sean válidos
        if (!mongoose.Types.ObjectId.isValid(identityUserId) || !mongoose.Types.ObjectId.isValid(profileUserId)) {
            throw new Error('ID de usuario inválido');
        }

        // Sacar info seguimiento
        let following = await Follow.findOne({ "user": identityUserId, "followed": profileUserId });

        let follower = await Follow.findOne({ "user": profileUserId, "followed": identityUserId });

        return {
            following: following || null,
            follower: follower || null
        };
    } catch (error) {
        console.error("Error en followThisUser:", error);
        return {
            following: null,
            follower: null
        };
    }
}

module.exports = {
    followUserIds,
    followThisUser
}