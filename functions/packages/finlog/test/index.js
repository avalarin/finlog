const { Pool } = require('pg')

async function main(args) {
    const pool = new Pool({
        connectionString: process.env.POSTGRES_URL,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD
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
