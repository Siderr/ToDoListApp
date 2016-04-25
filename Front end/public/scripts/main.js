/**
 * Created by tadas on 2016-04-21.
 */
// import ToDoApp from './app.jsx';
import React from 'react';
import ReactDOM from 'react-dom';
import TaskFilter from './components/taskFilter.jsx';
import TaskForm from './components/taskForm.jsx';
import TaskList from './components/taskList.jsx';
import Alert from './components/alert.jsx';

var ALL = "All";
var ACTIVE = "Active";
var COMPLETED = "Completed";

class ToDoApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {data: [], filter: ALL};
        this.showAlert = this.showAlert.bind(this);
        this.loadTasksFromServer = this.loadTasksFromServer.bind(this);
        this.loadTasksFromServer();
    }

    render() {
        return (
            <div>
                <h1>To Do List</h1>
                <TaskFilter currentFilter={this.state.filter} onChangeFilter={this.changeFilter.bind(this)}/>
                <TaskForm onTaskSubmit={this.handleTaskSubmit.bind(this)}/>
                <TaskList data={this.state.data} filter={this.state.filter} onDelete={this.handleTaskDelete.bind(this)}
                          onComplete={this.toggleComplete.bind(this)}
                          onUpdate={this.handleTaskUpdate.bind(this)}/>
            </div>
        );
    }

    showAlert(type,text) {
        ReactDOM.render( <Alert text = {text} type = {type} />,document.getElementById('alert'));
    }

    loadTasksFromServer() {
        $.ajax({
            url: this.props.url,
            type: 'GET',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                this.showAlert("danger", "Could not get data from server.");
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
                this.showAlert("success", data.message);
            }.bind(this),
            error: function (xhr, status, err) {
                this.showAlert("danger", xhr.status.toString().concat(" ", xhr.responseJSON.message));
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
                this.showAlert("success", data.message);
            }.bind(this),
            error: function (xhr, status, err) {
                this.showAlert("danger", xhr.status.toString().concat(" ", xhr.responseJSON.message));
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
                this.showAlert("success", data.message);
            }.bind(this),
            error: function (xhr, status, err) {
                this.showAlert("danger", xhr.status.toString().concat(" ", xhr.responseJSON.message));
            }.bind(this)
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
                this.showAlert("success", data.message);
            }.bind(this),
            error: function (xhr, status, err) {
                this.showAlert("danger", xhr.status.toString().concat(" ", xhr.responseJSON.message));
            }.bind(this)
        });
    }

    componentDidMount() {
        this.loadTasksFromServer.bind(this);
        setInterval(this.loadTasksFromServer.bind(this), this.props.pollInterval);
    }

    changeFilter(filter) {
        this.setState({filter: filter});
    }

}

ReactDOM.render(
    <ToDoApp url={"http://www.sprendziu.lt:8080/tasks"} pollInterval={3000}/>,
    document.getElementById('content')
)
