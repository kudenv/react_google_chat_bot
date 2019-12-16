import React, { Component } from "react";

class VoiceRecognitions extends Component {
  constructor(props) {
    super(props);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition != null) {
      this.recognition = this.createRecognition(SpeechRecognition);
    } else {
      console.warn(
        "The current browser does not support the SpeechRecognition API."
      );
    }
  }

  createRecognition = SpeechRecognition => {
    // const defaults = {
    //   continuous: true,
    //   interimResults: false,
    //   lang: "en-US"
    // };

    let recognition = new SpeechRecognition();

    // Object.assign(recognition, defaults, this.props);
    console.log(recognition);
    return recognition;
  };

  bindResult = event => {
    let interimTranscript = "";
    let finalTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
        console.log("result" + finalTranscript);
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    this.props.onResult({ interimTranscript, finalTranscript });
  };

  start = () => {
    console.log("Start");
    this.recognition.start();
  };

  stop = () => {
    console.log("Stop");
    this.recognition.stop();
  };

  abort = () => {
    this.recognition.abort();
  };

  componentWillReceiveProps({ stop }) {
    if (stop) {
      this.stop();
    }
  }

  componentDidMount() {
    // const events = [
    //   { name: "start", action: this.start },
    //   { name: "end", action: this.stop },
    //   { name: "error", action: this.props.onError }
    // ];

    // events.forEach(event => {
    //   this.recognition.addEventListener(event.name, event.action);
    // });

    this.recognition.addEventListener("result", this.bindResult);
  }

  componentWillUnmount() {
    this.abort();
  }

  render() {
    return (
      <div>
        <button onClick={() => this.start()}>start</button>
        <button onClick={() => this.stop()}>stop</button>
      </div>
    );
  }
}

export default VoiceRecognitions;
