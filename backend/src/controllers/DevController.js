const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStrings');
const { findConnections, sendMessage } = require('../websocket');

//index, show, store, update, destroy

module.exports = {
    
    async index(request, response){
        const devs = await Dev.find();
        return response.json(devs);
    },

    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;
        let dev = await Dev.findOne({ github_username });

        if(!dev){
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
            const { name = login, avatar_url, bio } = apiResponse.data;
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            });

            // Filtrar as conexoes que estao em até 10km de distancia
            // e que o novo dev tenha ao menos uma das techs filtradas

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            )

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }
    
        return response.json(dev);
    },

    async update(request, response){
        const {github_username, techs, name, avatar_url, bio, latitude, longitude} = request.body;
        let dev = await Dev.findOne({ github_username });

        if(dev){
            const techsArray = parseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }

            dev = await Dev.update({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            });
        };

        return response.json(dev);
    },

    async destroy(request, response){
        const { github_username } = request.body;
        let dev = await Dev.findOne({ github_username });

        if(dev){
            dev = await Dev.deleteOne({ github_username });
        }

        return response.json(dev);
    }
};