import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

const app = express();

app.use(express.json());

const port = 3000;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'usuarios',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.get('/users', async (req, res) => {
        const [rows] = await pool.query('SELECT * FROM users');
   return res.status(200).json({
       msg: 'Sucesso ao retornar usuários',
       data: rows
   });
});

app.post('/users', async (req, res) => {
    const { name, email } = req.body;
    const [result] = await pool.query('INSERT INTO users (name, email, id) VALUES (?, ?, null)', [name, email]);
    return res.status(201).json({
        msg: 'Usuário criado com sucesso',
        data: result
    });
});

// console.log("Resultado da inserção: ", result);

//if(result.affectedRows == 0) {
   // return res.status(400).json({
        msg: //'Erro ao criar usuário'
   // });
//}

//delete
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return res.status(201).json({
        msg: 'Usuário deletado com sucesso',
        data: result
    });
});

app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    const [result] = await pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
  

   res.status(200).json({
        msg: 'Usuário atualizado com sucesso',
        data: result
    });
});  

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
