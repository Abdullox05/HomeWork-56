const {isValidObjectId} = require("mongoose");

const Products = require("../models/Product_model");
const Custom_Error = require("../utils/custom_error");
const product_validation = require("../validations/product_validation");

const create = async (req, res, next) => {
  try {
    const {title, description, category, price} = req.body;

    const error = await product_validation({title, description, category, price});

    if (error) return res.status(400).json({message: error.message});

    const product = await Products.findOne({title: title});

    if (product) return res.status(400).json({message: "This Title has already been used"});

    const new_product = await Products.create({title, description, category, price});

    res.status(201).json({message: "Successfully created", data: new_product});
  } catch (error) {
    console.log(error)
    next(error);
  }
};

const find = async (req, res, next) => {
  try {
    const {category, search, sort_by, page, count} = req.query;

    const filter = [];
    
    if (search) {
      filter.push(
        {title: {$regex: `.*${search}.*`, $options: 'i'}},
        {description: {$regex: `.*${search}.*`, $options: 'i'}}
      );
    };

    let sorter;

    if (sort_by === "latest") {
      sorter = "-createdAt";
    }else if (sort_by === "max_price") {
      sorter = "-price";
    }else if (sort_by === "min_price") {
      sorter = "price";
    };

    let products;
    let products_count;

    if (!isNaN(page) && !isNaN(count) && page > 0 && count > 0) {
      if (category && filter.length && sorter) {
        products = await Products.find({category}).find({$or: filter}).sort(sorter).skip((page-1)*count).limit(count);
  
        products_count = await Products.find({category}).find({$or: filter}).countDocuments();
      }else if (category && filter.length) {
        products = await Products.find({category}).find({$or: filter}).skip((page-1)*count).limit(count);
        
        products_count = await Products.find({category}).find({$or: filter}).countDocuments();
      }else if (category && sorter) {
        products = await Products.find({category}).sort(sorter).skip((page-1)*count).limit(count);
  
        products_count = await Products.find({category}).countDocuments();
      }else if (filter.length && sorter) {
        products = await Products.find({$or: filter}).sort(sorter).skip((page-1)*count).limit(count);
  
        products_count = await Products.find({$or: filter}).countDocuments();
      }else if (category) {
        products = await Products.find({category}).skip((page-1)*count).limit(count);
  
        products_count = await Products.find({category}).countDocuments();
      }else if (filter.length) {
        products = await Products.find({$or: filter}).skip((page-1)*count).limit(count);
  
        products_count = await Products.find({$or: filter}).countDocuments();
      }else if (sorter) {
        products = await Products.find().sort(sorter).skip((page-1)*count).limit(count);
  
        products_count = await Products.find().countDocuments();
      }else {
        products = await Products.find().skip((page-1)*count).limit(count);
  
        products_count = await Products.find().countDocuments();
      };
    }else {
      if (category && filter.length && sorter) {
        products = await Products.find({category}).find({$or: filter}).sort(sorter);
  
        products_count = await Products.find({category}).find({$or: filter}).countDocuments();
      }else if (category && filter.length) {
        products = await Products.find({category}).find({$or: filter});
        
        products_count = await Products.find({category}).find({$or: filter}).countDocuments();
      }else if (category && sorter) {
        products = await Products.find({category}).sort(sorter);
  
        products_count = await Products.find({category}).countDocuments();
      }else if (filter.length && sorter) {
        products = await Products.find({$or: filter}).sort(sorter);
  
        products_count = await Products.find({$or: filter}).countDocuments();
      }else if (category) {
        products = await Products.find({category});
  
        products_count = await Products.find({category}).countDocuments();
      }else if (filter.length) {
        products = await Products.find({$or: filter});
  
        products_count = await Products.find({$or: filter}).countDocuments();
      }else if (sorter) {
        products = await Products.find().sort(sorter);
  
        products_count = await Products.find().countDocuments();
      }else {
        products = await Products.find();
  
        products_count = await Products.find().countDocuments();
      };
    };

    res.json({message: "Successfully shown", data: products, products_count: products_count});
  } catch (error) {
    console.log(error)
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const {id} = req.params;

    if (!isValidObjectId(id)) throw new Custom_Error(400, "Wrong ID");

    const product = await Products.findById(id);

    res.json({message: "Successfully shown", data: product});
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const {id} = req.params;

    if (!isValidObjectId(id)) throw new Custom_Error(400, "Wrong ID");

    const product = await Products.findById(id);

    const {
      title=product.title,
      description=product.description,
      category=product.category,
      price=product.price
    } = req.body;

    const error = await product_validation({title, description, category, price});

    if (error) return res.status(400).json({message: error.message});

    const data = await Products.findByIdAndUpdate(id, {
      title,
      description,
      category,
      price,
    });

    res.json({message: "Successfully updated", data: data});
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const {id} = req.params;

    if (!isValidObjectId(id)) throw new Custom_Error(400, "Wrong ID");

    const product = await Products.findByIdAndDelete(id);

    res.json({message: "Successfully removed", data: product});
  } catch (error) {
    next(error);
  }
};

module.exports = {create, find, findOne, update, remove};
