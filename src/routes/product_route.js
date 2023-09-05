const {Router} = require("express");

const {create, find, findOne, update, remove} = require("../controllers/product_controller");

const router = Router();

router.post("/product", create);

router.get("/product", find);

router.get("/product/:id", findOne);

router.put("/product/:id", update);

router.delete("/product/:id", remove);

module.exports = router;
