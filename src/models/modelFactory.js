// src/models/modelFactory.js
const pool = require('../database/db');

const createModel = (tableName) => ({
    async getAll() {
        try {
            const result = await pool.query(`SELECT * FROM ${tableName}`);
            return result.rows;
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            throw error;
        }
    },

    async getById(id) {
        const result = await pool.query(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);
        return result.rows[0];
    },

    async create(pesquisa1, pesquisa2, pesquisa3, comentario) {
        const result = await pool.query(
            `INSERT INTO ${tableName} (pesquisa1, pesquisa2, pesquisa3, comentario) VALUES ($1, $2, $3, $4) RETURNING *`,
            [pesquisa1, pesquisa2, pesquisa3, comentario]
        );
        return result.rows[0];
    },

    async update(id, pesquisa1, pesquisa2, pesquisa3, comentario) {
        const result = await pool.query(
            `UPDATE ${tableName} SET pesquisa1 = $1, pesquisa2 = $2, pesquisa3 = $3, comentario = $4 WHERE id = $5 RETURNING *`,
            [pesquisa1, pesquisa2, pesquisa3, comentario, id]
        );
        return result.rows[0];
    },

    async remove(id) {
        await pool.query(`DELETE FROM ${tableName} WHERE id = $1`, [id]);
    }
});

module.exports = createModel;
