const { Pool } = require('pg')

exports.main = async (args) => {
    const pool = new Pool({
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        options: `-c search_path=${process.env.POSTGRES_SCHEMA}`,
        ssl: {
            
            rejectUnauthorized: true,
            ca: process.env.POSTGRES_SSL_CA.replace(/\\n/g, '\n', ),
        }
    })

    try {
        const res = await pool.query('select * from accounts')
        console.log(res.rows)
        return res.rows
    } catch (err) {
        console.error(err)
        throw err
    }
}
