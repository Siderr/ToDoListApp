/**
 * Created by tadas on 2016-04-21.
 */
// import ToDoApp from './app.jsx';
import React from 'react';
import ReactDOM from 'react-dom';
import TaskFilter from './components/taskFilter.jsx';
import TaskForm from './components/taskForm.jsx';
import TaskList from './components/taskList.jsx';
import Task from './components/task.jsx';
import Alert from './components/alert.jsx';

var ALL = "All";
var ACTIVE = "Active";
var COMPLETED = "Completed";

class ToDoApp extends React.Component {

    constructor(props) {
        super(props);
        console.log(this);
        this.state = {data: [], filter: ALL};
    }

    render() {
        return (
            <div>
                <h1>To Do List</h1>
                <TaskFilter currentFilter={this.state.filter} onChangeFilter={this.changeFilter}/>
                <TaskForm onTaskSubmit={this.handleTaskSubmit}/>
                <TaskList data={this.state.data} filter={this.state.filter} onDelete={this.handleTaskDelete}
                          onComplete={this.toggleComplete}
                          onUpdate={this.handleTaskUpdate}/>
            </div>
        );
    }

    loadTasksFromServer() {
        console.log(this);
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
    }

    handleTaskSubmit(text) {
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
    }

    handleTaskUpdate(id, text) {
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
    }

    handleTaskDelete(id) {
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
    }

    toggleComplete(id) {
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
    }

    componentDidMount() {
        this.loadTasksFromServer();
        setInterval(this.loadTasksFromServer, this.props.pollInterval);
    }

    changeFilter(filter) {
        this.setState({filter: filter});
    }

}

ReactDOM.render(
    <ToDoApp url={"http://www.sprendziu.lt:8080/tasks"} pollInterval={3000}/>,
    document.getElementById('content')
)

module.exports = ToDoApp;
