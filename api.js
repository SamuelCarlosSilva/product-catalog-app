require('dotenv').config()

const productController = require('./productController')
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);


router.use((request, response, next) => {
    console.log('middleware');
    next();
});

router.route('/products').post((request, response) => {
    let product = {...request.body}

    productController.addProduct(product).then(product => {
        response.json(product)
    }).catch(error => {
        console.error('Error adding product:', error);
        response.status(500).json({ error: error.message || 'Internal server error' })
    })
})

router.route('/products').get((request, response) => {
    productController.getProducts().then(products => {
        response.json(products)
    }).catch(error => {
        response.status(500).send(error)
    })
})

router.route('/products/category/:category').get((request, response) => {
    let category = request.params.category;
    console.log('Searching for category:', category);
    productController.getProductByCategory(category).then(products => {
      if (products && products.length > 0) {
        response.json(products);
      } else {
        response.status(404).json({ message: 'No products found for this category' });
      }
    }).catch(error => {
      console.error('Error fetching products by category:', error);
      response.status(500).json({ error: 'Internal server error' });
    });
})

router.route('/products/:id').get((request, response) => {
    let id = request.params.id;
    productController.getProduct(id).then(product => {
      if (product && product.length > 0) {
        response.json(product[0]);
      } else {
        response.status(404).json({ message: 'Product not found' });
      }
    }).catch(error => {
      console.error('Error fetching product by ID:', error);
      response.status(500).json({ error: 'Internal server error' });
    });
})

router.route('/products/:id').delete((request, response) => {
    let id = request.params.id;
    productController.deleteProduct(id).then(product => {
      response.json(product);
    }).catch(error => {
      response.status(500).send(error);
    });
})

router.route('/products/:id').patch((request, response) => {
    let id = request.params.id;
    let product = {...request.body}
    productController.updateProduct(product, id).then(product => {
      response.json(product);
    }).catch(error => {
      response.status(500).send(error);
    });
})

var port = process.env.PORT || 8090;
app.listen(port);
console.log('API is running on port ' + port);

