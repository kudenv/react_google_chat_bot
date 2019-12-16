import React from "react";
import { connect } from "react-redux";
import { VoicePlayer } from "react-voice-components";
import VoiceRecognitions from "./SpRecorder";
import { msgChatMessageRequest } from "./store/actions";

const headingStyle = {
  position: "fixed",
  top: 0,
  backgroundColor: "white",
  borderBottom: "1px solid"
};
const listStyle = {
  paddingTop: "60px",
  paddingBottom: "60px"
};
const formPosStyle = {
  position: "fixed",
  bottom: 0,
  marginBottom: 0,
  backgroundColor: "white"
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textToBeSent: "",
      start: true,
      stop: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidUpdate() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  handleChange(e) {
    this.setState({ textToBeSent: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { textToBeSent } = this.state;
    const { sendMessage } = this.props;
    if (textToBeSent.trim() === "") {
      alert("Empty is not allowed! ");
      return;
    }
    sendMessage(textToBeSent);
    this.setState({ textToBeSent: "" });
  }

  onEnd = () => {
    this.setState({ start: false, stop: false });
    this.stop();
  };

  onResult = ({ finalTranscript }) => {
    this.setState({ textToBeSent: finalTranscript });
    this.setState({ stop: false });
    // this.props.result(finalTranscript);
  };

  // {sender === "Bot" ? <VoicePlayer play text={text} /> : null}

  render() {
    const { textToBeSent } = this.state;
    const { messages, onProcess } = this.props;
    return (
      <div>
        <h1 style={headingStyle}>React Chat Bot</h1>
        {/* message thread */}
        <ul style={listStyle}>
          {messages.map(({ text, sender, isErrorMessage }, index) => (
            <li
              key={index}
              style={{ color: isErrorMessage ? "crimson" : "dodgerblue" }}
            >
              [{sender}]: {text}
            </li>
          ))}
        </ul>
        {/* form input to send chat message */}
        <form onSubmit={this.handleSubmit} style={formPosStyle}>
          <input
            ref={input => input && input.focus()}
            type="text"
            value={onProcess ? "Waiting..." : textToBeSent}
            onChange={this.handleChange}
            placeholder="Type here to chat!"
            disabled={onProcess}
          />
        </form>
        <div>
          {this.state.start && (
            <VoiceRecognitions
              stop={this.state.stop}
              onResult={this.onResult}
              continuous={true}
              lang="en-US"
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => state;
const mapActionToProps = { sendMessage: msgChatMessageRequest };

export default connect(
  mapStateToProps,
  mapActionToProps
)(App);
