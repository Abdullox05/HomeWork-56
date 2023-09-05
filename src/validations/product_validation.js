const Joi = require("joi");

const product_validation = async (payload) => {
  const schema = Joi.object({
    title: Joi.string().max(32).required(),
    description: Joi.string().max(512).required(),
    category: Joi.string().max(32).required(),
    price: Joi.number().required(),
  });
  
  const {error} = schema.validate(payload);

  if (error) {
    return error;
  }else {
    return false;
  };
};

module.exports=product_validation;
