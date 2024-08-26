// dbService.js
const { pool, startTransaction, commitTransaction, rollbackTransaction } = require('../db.js');

async function fetchPrompt(id) {
    const client = await pool.connect();
    try {
        await startTransaction(client);

        const res = await client.query(`
            WITH selected_prompt AS (
            SELECT p_id, prompt
            FROM task_pipeline
            WHERE process_ai = 'chatGPT'
            AND prompt IS NOT NULL
            AND prompt_time IS NULL
            ORDER BY prio DESC, created
            LIMIT 1
            FOR UPDATE
            )
            UPDATE task_pipeline
            SET prompt_account = '<<GptAccount>>',
            prompt_time = NOW()
            WHERE p_id = (SELECT p_id FROM selected_prompt)
            RETURNING p_id, prompt, prompt_time;
        `);

        if (res.rows.length > 0) {
            const row = res.rows[0];
            if(row){
                await commitTransaction(client);
                return { prompt: row.prompt, promptId: row.p_id };
            }
            else
                return { prompt: '', promptId: '' };
            
        } else {
            await commitTransaction(client);
            return null;
        }
    } catch (err) {
        await rollbackTransaction(client);
        console.error('Error fetching prompt:', err);
        throw err;
    } finally {
        client.release();
    }
}


async function fetchInfo() {
    const client = await pool.connect();
    try {
        await startTransaction(client);

        const res = await client.query(`
            SELECT p_id, prompt
            FROM task_pipeline
            WHERE process_ai = 'chatGPT'
            AND prompt IS NOT NULL
            AND prompt_time IS NULL
            ORDER BY prio DESC, created
            FOR UPDATE
        `);

        const dbResult = await client.query('SELECT current_database() AS current_database;');
        const databaseName = dbResult.rows[0].current_database;

        const userResult = await client.query('SELECT current_user AS current_user;');
        const currentUser = userResult.rows[0].current_user;

        await commitTransaction(client);
        return { databaseName, currentUser, count: res.rowCount };
    } catch (err) {
        await rollbackTransaction(client);
        console.error('Error fetching info:', err);
        throw err;
    } finally {
        client.release();
    }
}

async function updatePrompt(p_id, result) {
    const client = await pool.connect();
    try {
        await startTransaction(client);
        await client.query(`
            UPDATE task_pipeline
            SET prompt_account = '<<GptAccount>>',
                result = $1
            WHERE p_id = $2
        `, [result, p_id]);
        await commitTransaction(client);
    } catch (err) {
        await rollbackTransaction(client);
        console.error('Error updating prompt:', err);
        throw err;
    } finally {
        client.release();
    }
}

module.exports = { fetchPrompt, updatePrompt, fetchInfo };
