import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.fetchSubscribeMsg = this.fetchSubscribeMsg.bind(this);
    this.state = { publishTopic: '', publishMsg: '', subscribeTopic: '', subscribeMsgs: '' };
  }

  fetchSubscribeMsg(subscribeTopic) {
    fetch(`http://localhost:8080/pubsub/sub/${subscribeTopic}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'get'
    })
    .then(resp => resp.json())
    .then((json) => {
      this.setState({ subscribeMsgs: `${this.state.subscribeMsgs}\n${json.data.topic}: ${json.data.message}` });
      this.fetchSubscribeMsg(subscribeTopic);
    })
    .catch((err) => {
      console.log('subscribe err', err);              
    });
  }

  render() {
    const { publishTopic, publishMsg, subscribeTopic, subscribeMsgs } = this.state;

    const compStyle = {

      display: 'flex',
      flex: '0 1 auto',
      flexFlow: 'column nowrap',
//      justifyContent: 'space-between',

      margin: 10
    };

    const itemStyle = {
      margin: 2      
    };

    const publishDiv = (
      <form style={compStyle}>
        <fieldset>
          <legend>Publisher</legend>
          <input type="text" name="publishTopic" 
            value={publishTopic} placeholder="Topic" style={{ ...itemStyle, width: 100 }}
            onChange={(e) => {
              this.setState({ publishTopic: e.target.value });
            }}/>
          <input type="text" name="publishMsg" 
            value={publishMsg} placeholder="Message" style={{ ...itemStyle, width: 300 }}
            onChange={(e) => {
              this.setState({ publishMsg: e.target.value });
            }}/>
          <input type="button" name="publish" value="Publish" style={itemStyle} 
          onClick={(e) => {          
            fetch('http://localhost:8080/pubsub/pub', {
              headers: { 'Content-Type': 'application/json' },
              method: 'post',
              body: JSON.stringify({ topic: publishTopic, msg: publishMsg })
            })
            .then(resp => resp.json())
            .then((json) => {
//              console.log('publish json', json);
            })
            .catch((err) => {
              console.log('publish err', err);              
            });
          }}/>
        </fieldset>
      </form>

      );

    const subscribeDiv = (
      <form style={compStyle}>
        <fieldset>
          <legend>Subscribers</legend>
          <input type="text" name="subscribeTopic" 
            value={subscribeTopic} placeholder="Topic" style={{ ...itemStyle, width: 100 }}
            onChange={(e) => {
              this.setState({ subscribeTopic: e.target.value });
            }}/>
          <input type="button" name="subscribe" value="Subscribe" style={itemStyle} 
            onClick={(e) => {
              this.fetchSubscribeMsg(subscribeTopic);
          }}/><br/>
          <textarea rows="12" cols="100" value={subscribeMsgs}
            placeholder="topic: message" style={{ ...itemStyle, width: 400 }} readOnly />
        </fieldset>
      </form>
      );

    return (
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <h1 className="App-title">{'Publisher/Subscriber Demo'}</h1>
        </header>
        <div>{publishDiv}</div>
        <div>{subscribeDiv}</div>
      </div>
    );
  }
}

export default App;
