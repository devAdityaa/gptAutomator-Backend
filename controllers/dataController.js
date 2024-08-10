// dataController.js
const { fetchPrompt, updatePrompt, fetchInfo } = require('../services/dbService.js');

async function getPrompt(req, res) {
    try {
        const id = parseInt(req.query.id);
        const prompt = await fetchPrompt(id);

        if (!prompt) {
            return res.status(404).json({ message: 'No prompt found' });
        }

        res.json(prompt);
    } catch (err) {
        console.error('Error fetching prompt:', err);
        res.status(500).json({ message: 'Error fetching prompt' });
    }
}

async function getInfo(req, res) {
    try {
        const info = await fetchInfo();

        if (!info) {
            return res.status(404).json({ message: 'No information found' });
        }

        res.json(info);
    } catch (err) {
        console.error('Error fetching info:', err);
        res.status(500).json({ message: 'Error fetching info' });
    }
}

async function postPrompt(req, res) {
    const { p_id, result } = req.body;

    try {
        await updatePrompt(p_id, result);
        res.status(200).json({ message: 'Prompt updated successfully' });
    } catch (err) {
        console.error('Error updating prompt:', err);
        res.status(500).json({ message: 'Error updating prompt' });
    }
}

module.exports = { getPrompt, postPrompt, getInfo };
