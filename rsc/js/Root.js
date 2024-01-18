/**
 * Copyright Noorul Misbah 2024-present. All rights reserved.
 */

const data = JSON.parse(document.querySelector('[data]').innerText);

/**
 * The Timers interface
 * @class TimersInterface
 */
class TimersInterface extends React.Component {
    state = { 
        timers: data,
        addTimerButtonClicked: false,
    };

    showAddTimerForm = () => {
        this.setState({ addTimerButtonClicked: true });
    }

    closeAddTimerForm = () => {
        this.setState({ addTimerButtonClicked: false });
    }
    
    closeUpdateForm = () => {
        const newList = [...this.state.timers];

        newList.forEach(timer => timer.onEdit = false);
        this.setState({ timers: newList });
    }
    
    addTimer = (title, description) => {
        if (itemExists(title, this.state.timers)) {
            showNotificationBox('Unsuccessful', 'Item is not added because an item with the same title exists. There can\'t be multiple items with the same title.');
            return;
        }

        const newList = [...this.state.timers, { title, description, timeElapsed: 0, onEdit: false }];
        this.closeAddTimerForm();
        this.setState({ timers: newList });
        uploadUpdates(newList);
    }

    removeTimer = (title) => {
        const newList = this.state.timers.filter(timer => timer.title !== title);
        this.setState({ timers: newList });
        uploadUpdates(newList);
    }
    
    updateTimer = (initialName, newName, description) => {
        const newList = [...this.state.timers];
        
        if (itemExists(newName, this.state.timers)) {
            showNotificationBox('Update Failed', 'Information not updated because an item with same title exists. There can\'t be multiple items with the same title.');
            return;
        }

        for (var i = 0; i < newList.length; i++) {
            if (newList[i].title === initialName) {
                newList[i].title = newName;
                newList[i].description = description;
                break;
            }
        }
        
        newList.forEach(timer => timer.onEdit = false);
        this.setState({ timers: newList });
        uploadUpdates(newList);
    }
    
    editTimer = (title) => {
        const newList = [...this.state.timers];
        newList.forEach(timer => timer.onEdit = false);

        for (var i = 0; i < newList.length; i++) {
            if (newList[i].title === title) {
                newList[i].onEdit = true;
                break;
            }
        }

        this.setState({ timers: newList });
    }

    stopTimer = (title, time) => {
        var newList = [...this.state.timers];

        for (var i = 0; i < newList.length; i++) {
            if (newList[i].title === title) {
                newList[i].timeElapsed = time;
                break;
            }
        }

        this.setState({ timers: newList });
        uploadUpdates(this.state.timers);
    }

    render() {
        return (
            <div className='timers'>
                {
                    this.state.timers.length < 1 ? <p className='status-text'>No timer to display!</p> :
                    <Timers
                        timers={this.state.timers}
                        removeTimer={this.removeTimer}
                        editTimer={this.editTimer}
                        updateTimer={this.updateTimer}
                        closeUpdateForm={this.closeUpdateForm}
                        stopTimer={this.stopTimer}
                    />
                }
                { 
                    this.state.addTimerButtonClicked ? 
                    <AddTimerForm closeAddTimerForm={this.closeAddTimerForm} addTimer={this.addTimer} /> : 
                    (!this.state.timers.some(timer => timer.onEdit) && <AddTimer showAddTimerForm={this.showAddTimerForm} />)
                }
            </div>
        );
    }
}

class Timers extends React.Component {
    render() {
        const timers = this.props.timers.map((timer, index) => {
            return (
                <Timer
                    key={index}
                    index={index}
                    removeTimer={this.props.removeTimer}
                    editTimer={this.props.editTimer}
                    updateTimer={this.props.updateTimer}
                    closeUpdateForm={this.props.closeUpdateForm}
                    stopTimer={this.props.stopTimer} 
                    {...timer}
                />
            );
        });
        return (
            <div>
                { timers }
            </div>
        );
    }
}

class Timer extends React.Component {
    state = { 
        currentTime: this.props.timeElapsed, 
        timerRunning: false,
        intervalId: ''
    };

    startTime = () => {
        var time = this.state.currentTime;
        this.setState({ timerRunning: true });
        
        var id = setInterval(() => {
            time += 1000;
            this.setState({ currentTime: time });
        }, 1000);

        this.setState({ intervalId: id })
    };

    stopTime = () => {
        clearInterval(this.state.intervalId);
        this.setState({ timerRunning: false });
        this.props.stopTimer(this.props.title, this.state.currentTime);
    }

    render() {
        if (this.props.onEdit)
            return (
                <UpdateTimerForm 
                    className="timer-form" 
                    initialName={this.props.title}
                    updateTimer={this.props.updateTimer}
                    closeUpdateForm={this.props.closeUpdateForm} /> 
            );
        return (
            <div className="timer">
                <p className="timer-title">{ this.props.title }</p>
                <p className="timer-description">{ this.props.description }</p>
                <p className="timer-time-string">{ toReadableTimeString(this.state.currentTime) }</p>
                <div className="icons">
                    <img 
                        draggable="false" 
                        className="icon edit-timer" 
                        src="imgs/edit.png" 
                        alt="Edit timer icon"
                        onClick={() => {
                            if (this.state.timerRunning)
                                showNotificationBox('Unable to Update', 'Can\'t update a running timer. Stop the timer first and then try updating it.');
                            else
                                this.props.editTimer(this.props.title);
                        }}
                    />
                    <img 
                        draggable="false" 
                        className="icon remove-timer" 
                        src="imgs/bin.png" 
                        alt="Remove timer icon"
                        onClick={() => {
                            if (this.state.timerRunning)
                                showNotificationBox('Unable to Remove', 'Can\'t remove a running timer. Stop the timer first and then try removing it.');
                            else
                                this.props.removeTimer(this.props.title);
                        }}
                    />
                </div>
                {
                    this.state.timerRunning ? 
                    <button 
                        className='timer-state stop' 
                        onClick={() => this.stopTime()}
                    >Stop</button> :
                    <button 
                        className="timer-state start"
                        onClick={() => this.startTime()}
                    >Start</button>
                }
            </div>
        );
    }
}

class AddTimer extends React.Component {
    render() {
        return (
            <center>
                <button className='add-timer' onClick={this.props.showAddTimerForm}>+</button>
            </center>
        );  
    }   
}

class AddTimerForm extends React.Component {
    state = { title: '', description: '' }

    render() {
        return (
            <div className='timer-form'>
                <label htmlFor='title-field'>Title</label>
                <input 
                    id='title-field' 
                    type='text' 
                    onChange={((arg) => this.setState({ title: arg.target.value }))}
                />
                <label htmlFor='description-field'>Description</label>
                <input 
                    id='description-field' 
                    type='text' 
                    onChange={((arg) => this.setState({ description: arg.target.value }))} 
                />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button 
                        className='form-submit-button'
                        onClick={() => {
                            if (!(this.state.title) || !(this.state.description))
                                 showNotificationBox('Invalid Entry', 'Please provide a title and a description.')
                            else
                                 this.props.addTimer(this.state.title, this.state.description);
                        }}
                    >Add</button>
                    <button className='form-cancel-button' onClick={this.props.closeAddTimerForm}>Cancel</button>
                </div>
            </div>
        );
    }
}

class UpdateTimerForm extends React.Component {
    state = { title: '', description: '' }
    render() {
        return (
            <div className='timer-form'>
                <label htmlFor='title-field'>Title</label>
                <input 
                    id='title-field' 
                    type='text' 
                    onChange={(e) => this.setState({ title: e.target.value })} 
                />
                <label htmlFor='description-field'>Description</label>
                <input 
                    id='description-field' 
                    type='text' 
                    onChange={(e) => this.setState({ description: e.target.value })}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button 
                        className='form-submit-button'
                        onClick={() => {
                            if (!(this.state.title) || !(this.state.description))
                                 showNotificationBox('Invalid Entry', 'Please provide a title and a description.');
                            else
                                this.props.updateTimer(this.props.initialName, this.state.title, this.state.description);
                            }}
                    >Update</button>
                    <button 
                        className='form-cancel-button'
                        onClick={this.props.closeUpdateForm}
                    >Cancel</button>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<TimersInterface />, document.getElementById('content'));