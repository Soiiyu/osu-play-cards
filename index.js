// osu-play-cards for creating a graphic that displays information of an osu! play
// Created by Soiiyu @ https://github.com/Soiiyu

const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require('fs');

if (!fs.existsSync('./config.json')) {
    fs.writeFileSync('./config.json', JSON.stringify({ api_key: '', port: 3000 }, null, 4))
    
    console.log('Created config.json, Fill in your API key and run again.\nYou can create one at https://osu.ppy.sh/p/api under Legacy API')
    process.exit()
}

if (!fs.existsSync('./cards')) {
    fs.mkdirSync('./cards')
}

const config = require('./config.json')

const app = express();

app.use(express.static('app'))
app.use(express.json())

// For fetching and parsing osu! scores from https://osu.ppy.sh/scores/osu/<score-id> urls
app.post('/fetchData', async (req, res) => {
    const { type, data } = req.body
    console.log(`fetching ${type} ${data}`)
    try {
        if (type == 'score') {
            // data contains score url
            const score = await fetch(data).then(res => res.text())
            const scoreJSON = JSON.parse(score.match(/<script id="json-show" type="application\/json">([\s\S]+?)<\/script>/m)[1].trim())
            
            res.json({ status: 'success', score: scoreJSON })
            console.log('Successfully fetched score!')
        } else if (type == 'player') {
            // data contains player id
            const user = await fetch(`https://osu.ppy.sh/api/get_user?k=${config.api_key}&u=${data}`).then(res => res.json())

            const rank = user[0].pp_rank
            const totalpp = user[0].pp_raw

            res.json({ status: 'success', rank, totalpp })
            console.log(`Successfully parsed rank ${rank} and ${totalpp}pp`)
        }
    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error })
    }
})

app.listen(config.port, () => {
    console.log(`App is running on http://localhost:${config.port}`);
});
