var express = require('express');
var router = express.Router();
var Task = require('./models/task');

router.use(function timeLog(req, res, next) {
    console.log('Request Received: ', dateDisplayed(Date.now()));
    next();
});

router.get('/', function (req, res) {
    res.json({message: 'Router initialised. RESTAPI should work.'});
});

router.route('/tasks')
    .get(function (req, res) {
        Task.find(function (err, tasks) {
            if (err) {
                res.status(500).json({message: " Could not load tasks. Internal server error."});
                return;
            }
            res.json(tasks);
        });
    })
    .post(function (req, res) {
        var task = new Task();
        task.text = req.body.text;
        task.save(function (err) {
            if (err) {
                res.status(500).json({message: " Could not save new TODO. Internal server error."});
                return;
            }
            res.json({message: 'Task created successfully!'});
        });
    });

router.route('/tasks/:task_id')
    .get(function (req, res) {
        Task.findById(req.params.task_id, function (err, task) {
            if (err) {
                res.status(404).send(err);
                return;
            }
            if (task == null) {
                res.status(404).json({"message": "Not found."});
                return;
            }
            res.json(task)
        });
    })
    .put(function (req, res) {
        Task.findById(req.params.task_id, function (err, task) {
            if (err) {
                res.status(404).send(err);
                return;
            }
            task.text = req.body.text;
            task.save(function (err) {
                if (err) {
                    res.status(500).json({message: " Could not save new TODO. Internal server error."});
                    return;
                }
                res.json({message: 'Task successfully updated.'});
            });
        });
    })
    .delete(function (req, res) {
        Task.remove({
            _id: req.params.task_id
        }, function (err, message) {
            if (err) {
                res.status(404).json({"message": "Could not delete. ID not found."});
                return;
            }
            res.json({message: 'Successfully deleted message!'});
        });
    });

router.route('/tasks/complete/:task_id')
    .put(function (req, res) {
        Task.findById(req.params.task_id, function (err, task) {
            if (err) {
                res.status(404).send(err);
                return;
            }
            task.completed = !task.complete;
            task.save(function (err) {
                if (err) {
                    res.status(500).json({message: " Could update TODO. Internal server error."});
                    return;
                }
                res.json({message: 'Task updated successfully! Good job!'});
            });
        });
    });

module.exports = router;

function dateDisplayed(timestamp) {
    var date = new Date(timestamp);
    return (date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
}

