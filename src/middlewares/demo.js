const demo = async (req, res, next) => {
  req.demo = {
    name: "Suzal",
    age: 20
  }
  next();
  res.cookie("demo", "demo");
};

module.exports = demo;
