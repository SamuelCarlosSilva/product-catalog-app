var config = require('./dbConfig')

const sql = require('mssql')

async function addProduct(product){
    try {
        let pool = await sql.connect(config)
        let products = await pool.request()
        .input('Name', sql.NVarChar, product.name)
        .input('Price', sql.NVarChar, product.price)
        .input('Quantity', sql.NVarChar, product.quantity)
        .input('Description', sql.NVarChar, product.description)
        .input('Rating', sql.NVarChar, product.rating)
        .input('Category', sql.NVarChar, product.category)
        .query(`INSERT INTO [dbo].[Products]
        (Name, Price, Quantity, Description, Rating, Category)
        VALUES (
        @Name, @Price, @Quantity, @Description, @Rating, @Category
        )
        `)

        return products.recordset;
    } catch (error) {
        console.log(error)
    }
}

async function getProducts(){
    try {
        let pool = await sql.connect(config)
        let products = await pool.request().query('SELECT * FROM [dbo].[Products]')
        return products.recordset
    } catch (error) {
        console.log(error)
    }
}

async function getProduct(id){
    try {
        let pool = await sql.connect(config);
        let products = await pool.request()
            .input('input_parameter', sql.Int, id)
            .query(`SELECT * FROM [dbo].[Products] WHERE ID = @input_parameter`);
        return products.recordset;
    } catch (error) {
        console.log(error);
        return [];
    }
}

async function getProductByCategory(category){
    try {
        let pool = await sql.connect(config);
        let products = await pool.request()
            .input('input_parameter', sql.NVarChar, category)
            .query(`SELECT * FROM [dbo].[Products] WHERE Category = @input_parameter`);
        return products.recordset;
    } catch (error) {
        console.log(error);
        return [];
    }
}


async function deleteProduct(id){
    try {
        let pool = await sql.connect(config);
        let products = await pool.request()
            .input('input_parameter', sql.Int, id)
            .query(`DELETE FROM [dbo].[Products] WHERE ID = @input_parameter`);
        return products.recordset;
    } catch (error) {
        console.log(error);
        return [];
    }
}

async function updateProduct(product, id){
    try {
        let pool = await sql.connect(config)
        let products = await pool.request()
        .input('input_parameter', sql.Int, id)
        .input('Name', sql.NVarChar, product.name)
        .input('Price', sql.NVarChar, product.price)
        .input('Quantity', sql.NVarChar, product.quantity)
        .input('Description', sql.NVarChar, product.description)
        .input('Rating', sql.NVarChar, product.rating)
        .input('Category', sql.NVarChar, product.category)
        .query(`UPDATE [dbo].[Products]
        SET
           [Name] = @Name,
           [Price] = @Price,
           [Quantity] = @Quantity,
           [Description] = @Description,
           [Rating] = @Rating,
           [Category] = @Category
           WHERE ID = @input_parameter
        `)

        return products.recordset;
    } catch (error) {
        console.log(error)
    }
}




module.exports = {getProducts, addProduct, getProduct, deleteProduct, updateProduct, getProductByCategory}

