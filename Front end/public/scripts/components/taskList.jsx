/**
 * Created by tadas on 2016-04-20.
 */
import React from 'react';
import Task from './task.jsx';

var ALL = "All";
var ACTIVE = "Active";
var COMPLETED = "Completed";


class TaskList extends React.Component {
    render() {
        console.log(this);
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
}

module.exports = TaskList;