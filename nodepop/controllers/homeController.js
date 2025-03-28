import Product from '../models/Product.js'

export async function index(req, res, next) {
  try {
 

    res.locals.agents = await Product.find();
    res.render('home', { title: 'Express' });

  } catch (error) {
    next(error);
  }
}
