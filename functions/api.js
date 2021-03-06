const express = require('express');
const bodyparser = require('body-parser');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

router.get('/:operation/:num1(\\d+)/:num2(\\d+)', function (req, res) {

    if (Number.isSafeInteger(Number(req.params.num1)) == false | Number.isSafeInteger(Number(req.params.num2)) == false) {
        res.status(400).send("Please check your input. Ensure that you are using 64-bit limited integers")
    }

    if (req.params.operation === "add") {
        res.set("Content-Type", "text/plain")
        solution = Number(req.params.num1) + Number(req.params.num2)
        checkBounds(solution, res);
        res.send(String(solution) + '\r\n')
    } else if (req.params.operation === "subtract") {
        res.set("Content-Type", "text/plain")
        solution = Number(req.params.num1) - Number(req.params.num2)
        checkBounds(solution, res);
        res.send(String(solution) + '\r\n')
    } else if (req.params.operation === "multiply") {
        res.set("Content-Type", "text/plain")
        solution = Number(req.params.num1) * Number(req.params.num2)
        checkBounds(solution, res);
        res.send(String(solution) + '\r\n')
    } else if (req.params.operation === "divide") {
        res.set("Content-Type", "text/plain")
        if (Number(req.params.num2) == 0) {
            res.send("undefined" + '\r\n')
        }
        solution = Number(req.params.num1) / Number(req.params.num2)
        checkBounds(solution, res);
        res.status(200).send(String(solution)).end();
    } else {
        res.status(500).send('Internal Error');
    }
});

function checkBounds(n1, res) {
    if (Number.isSafeInteger(Number(n1)) == false) {
        res.status(500).send("Internal Error, please check your input")
    }
}

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

router.post('/', function (req, res) {
    // var operation = req.body.operation;
    // var arguments = req.body.arguments;

    if (!["add", "subtract", "multiply", "divide"].includes(req.body.operation)) {
        res.status(400).send({error: "Please check your parameters. They must be in the correct JSON format. Please see the README for further information"});
    }

    if (Number.isInteger(req.body.arguments[0]) == false | Number.isInteger(req.body.arguments[1]) == false) {
        res.status(400).send({error: "Please check your parameters. They must be valid integers. Please see the README for further information"});
    }

    if (Number.isSafeInteger(Number(req.body.arguments[0])) == false | Number.isSafeInteger(Number(req.body.arguments[1])) == false) {
        res.status(500).send("Please check your input. Ensure that you are using 64-bit limited integers")
    }

    if (req.body.operation === "add") {
        res.set("Content-Type", "application/json")
        solution = Number(req.body.arguments[0]) + Number(req.body.arguments[1])
        checkBounds(solution, res);
        res.json({"result": solution})
    } else if (req.body.operation === "subtract") {
        res.set("Content-Type", "application/json")
        solution = Number(req.body.arguments[0]) - Number(req.body.arguments[1])
        checkBounds(solution, res);
        res.json({"result": solution})
    } else if (req.body.operation === "multiply") {
        res.set("Content-Type", "application/json")
        solution = Number(req.body.arguments[0]) * Number(req.body.arguments[1])
        checkBounds(solution, res);
        res.json({"result": solution})
    } else if (req.body.operation === "divide") {
        res.set("Content-Type", "application/json")
        if (Number(req.body.arguments[1]) == 0) {
            res.json({"result": null})
        }
        solution = Number(req.body.arguments[0]) / Number(req.body.arguments[1])
        checkBounds(solution, res);
        res.json({"result": solution})
    } else {
        res.send(404);
    }
});

app.use('/', router);

app.use((request, response, next) => {
    response.status(400).send("Please check your input. See the README for further information")
})

module.exports.handler = serverless(app);