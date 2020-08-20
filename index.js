const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "web/pug_views"));

//statics
app.use('/assets', express.static('web/assets'))

//views
router.get("/", (req, res) => {
	res.render("entry");
});

router.get("/pass", (req, res) => {
	res.render("pass",{
  		location: 'YOUR MOTHER',
  		date: 'Anyday',
  		time: 'Anytime'
	});
});

app.use("/", router);
app.listen(process.env.port || 3000);

console.log("Running Mock SafeEntry on port 3000");