var ESCAPE_KEY = 27;
var ENTER_KEY = 13;
var ALL = "All";
var ACTIVE = "Active";
var COMPLETED = "Completed";

var TodoListBox = React.createClass({
    loadTasksFromServer: function () {
        $.ajax({
            url: this.props.url,
            type: 'GET',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                showAlert("danger", "Could not get data from server.");
            }
        });
    },
    handleTaskSubmit: function (text) {
        $.ajax({
            url: this.props.url,
            type: 'POST',
            datatype: 'json',
            data: {'text': text},
            cache: false,
            success: function (data) {
                this.loadTasksFromServer();
                showAlert("success", data.message);
            }.bind(this),
            error: function (xhr, status, err) {
                showAlert("danger", xhr.status.toString().concat(" ", xhr.responseJSON.message));
            }
        });
    },
    handleTaskUpdate: function (id, text) {
        var url = this.props.url.concat("/").concat(id);
        $.ajax({
            url: url,
            type: 'PUT',
            datatype: 'json',
            data: {'text': text},
            cache: false,
            success: function (data) {
                this.loadTasksFromServer();
                showAlert("success", data.message);
            }.bind(this),
            error: function (xhr, status, err) {
                showAlert("danger", xhr.status.toString().concat(" ", xhr.responseJSON.message));
            }
        });
    },
    handleTaskDelete: function (id) {
        var tasks = this.state.data;
        var newTasks = this.state.data.filter(function (task) {
            return id != task._id;
        });
        this.setState({data: newTasks});
        var url = this.props.url.concat("/").concat(id);
        $.ajax({
            url: url,
            type: 'DELETE',
            dataType: 'json',
            cache: false,
            success: function (data) {
                showAlert("success", data.message);
            },
            error: function (xhr, status, err) {
                showAlert("danger", xhr.status.toString().concat(" ", xhr.responseJSON.message));
            }
        });
    },
    markCompleted: function (id) {
        var tasks = this.state.data;
        tasks.forEach(function (task) {
            if (task._id == id) {
                task.completed = !task.completed;
            }
        });
        this.setState({data: tasks});
        var url = this.props.url.concat("/complete/").concat(id);
        $.ajax({
            url: url,
            type: 'PUT',
            dataType: 'json',
            cache: false,
            success: function (data) {
                showAlert("success", data.message);
            }.bind(this),
            error: function (xhr, status, err) {
                showAlert("danger", xhr.status.toString().concat(" ", xhr.responseJSON.message));
            }
        });
    },
    componentDidMount: function () {
        this.loadTasksFromServer();
        setInterval(this.loadTasksFromServer, this.props.pollInterval);
    },
    getInitialState: function () {
        return {data: [], filter: ALL};
    },
    changeFilter: function (filter) {
        this.setState({filter: filter});
        // this.forceUpdate();
    },
    render: function () {
        return (
            <div className="toDoListBox container">
                <h1>To Do List</h1>
                <TaskFilter currentFilter={this.state.filter} onChangeFilter={this.changeFilter}/>
                <TaskForm onTaskSubmit={this.handleTaskSubmit}/>
                <TaskList data={this.state.data} filter={this.state.filter} onDelete={this.handleTaskDelete}
                          onComplete={this.markCompleted}
                          onUpdate={this.handleTaskUpdate}/>
            </div>
        );
    }
});

var TaskList = React.createClass({
    render: function () {
        var onDelete = this.props.onDelete;
        var onComplete = this.props.onComplete;
        var onUpdate = this.props.onUpdate;
        var currentFilter = this.props.filter;
        var shownTasks = this.props.data.filter(function (task) {
            switch (currentFilter) {
                case ALL :
                    return true;
                case ACTIVE :
                    return task.completed == false;
                case COMPLETED :
                    return task.completed == true;
            }
        });

        var taskNodes = shownTasks.map(function (task) {
            return (
                <Task completed={task.completed} text={task.text} id={task._id}
                      onTaskDelete={onDelete} onComplete={onComplete} onUpdate={onUpdate}/>
            );
        }, this);
        return (
            <div className="taskList">
                {taskNodes}
            </div>
        )
    }
});

var Task = React.createClass({
    getInitialState: function () {
        return {editing: false};
    },
    handleSubmit: function (e) {
        var text = this.state.editText.trim();
        this.props.onUpdate(this.props.id, text);
        this.editing = false;
        this.forceUpdate();
    },
    handleDelete: function () {
        this.props.onTaskDelete(this.props.id);
    },
    complete: function () {
        this.props.onComplete(this.props.id);
    },
    edit: function (e) {
        e.preventDefault();
        this.editing = true;
        this.setState({editText: this.props.text});
        this.forceUpdate();
    },
    handleChange: function (e) {
        this.setState({editText: e.target.value});
    },
    handleKeyDown: function (e) {
        if (e.which === ESCAPE_KEY) {
            this.editing = false;
            this.forceUpdate();
        } else if (e.which === ENTER_KEY) {
            this.handleSubmit(e);
        }
    },
    render: function () {
        var label = classNames({
            'completed': this.props.completed
        });
        if (!this.editing) {
            return (
                <div className="task">
                    <input type="checkbox" checked={this.props.completed} onChange={this.complete}></input>
                    <label className={label} onDoubleClick={this.edit}>{this.props.text}</label>
                    <a onClick={this.handleDelete}>
                        <i className={"fa fa-trash"}></i>
                    </a>
                </div>
            )
        } else {
            return (
                <div className="task">
                    <input type="checkbox" checked={this.props.completed} onChange={this.complete}></input>
                    <input className="taskEdit" value={this.state.editText}
                           onChange={this.handleChange} onKeyDown={this.handleKeyDown}
                           onBlur={this.handleSubmit}></input>
                    <a onClick={this.handleDelete}>
                        <i className={"fa fa-trash"}></i>
                    </a>
                </div>
            )
        }
    }
});

var TaskForm = React.createClass({
    getInitialState: function () {
        return {text: ''};
    },
    handleTextChange: function (e) {
        this.setState({text: e.target.value});
    },
    handleSubmit: function (e) {
        e.preventDefault();
        var text = this.state.text.trim();
        if (!text) {
            return;
        }
        this.props.onTaskSubmit(text);
        this.setState({text: ''});
    },
    render: function () {
        return (
            <form className="taskForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="New TODO here"
                       value={this.state.text}
                       onChange={this.handleTextChange}/>
                <input type="submit" value="Add"/>
            </form>
        )
    }
});

var TaskFilter = React.createClass({
    changeFilter: function (e) {
        e.preventDefault();
        this.props.onChangeFilter(e.target.innerHTML);
    },
    render: function () {
        var filter = this.props.currentFilter;
        console.log(filter);
        return (
            <div className="taskFilter">
                <button className={classNames('btn', 'btn-default',{ 'btn-primary' : filter == ALL})}
                        onClick={this.changeFilter}>All
                </button>
                <button className={classNames('btn', 'btn-default',{ 'btn-primary' : filter == ACTIVE})}
                        onClick={this.changeFilter}>Active
                </button>
                <button className={classNames('btn', 'btn-default',{ 'btn-primary' : filter == COMPLETED })}
                        onClick={this.changeFilter}>Completed
                </button>
            </div>
        )
    }
});

ReactDOM.render(
    <TodoListBox url="http://www.sprendziu.lt:8080/tasks" pollInterval={3000}/>,
    document.getElementById('content')
);
