//webkitURL
URL = window.URL || window.webkitURL;

var gumStream;     //from getUserMedia() 取得聲音串流
var rec;           //Recorder.js object
var input;         //MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext; //audio context to help us record
//new audio context to help us record
var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");
// add events to those 3  buttons
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
pauseButton.addEventListener("click", pauseRecording);

function startRecording(){
  console.log("recordButton clicked");
  // constraints: a object to specify the type of media to request
  var constraints = { audio: true, video:false }
  // 先disable the record button
  recordButton.disabled = true;
  stopButton.disabled = false;
  pauseButton.disabled = false

  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
    console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
    // create an audio context after getUserMedia is called
    audioContext = new AudioContext();
    document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"
    gumStream = stream;
    input = audioContext.createMediaStreamSource(stream);
    rec = new Recorder(input,{numChannels:1})
    //start recording process
    rec.record()
    console.log("Recording started");
  }).catch(function(err) {
    //enable the record button if getUserMedia() fails
    recordButton.disabled = false;
    stopButton.disabled = true;
    pauseButton.disabled = true
    });
  }

  function pauseRecording(){
    console.log("pauseButton clicked rec.recording=",rec.recording );
    if (rec.recording){
      //pause
      rec.stop();
      pauseButton.innerHTML="Resume";
    }else{
      //resume
      rec.record()
      pauseButton.innerHTML="Pause";
    }
  }

  function stopRecording() {
    console.log("stopButton clicked");
    //disable the stop button, enable the record to allow for new recording
    stopButton.disabled = true;
    recordButton.disabled = false;
    pauseButton.disabled = true;

    pauseButton.innerHTML="Pause";
    //tell the recorder to stop the recording
    rec.stop();
    //stop microphone access
    gumStream.getAudioTracks()[0].stop(); 
    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(createDownloadLink);
  }

  /* When the wav export process is complete createDownloadLink(blob) is called
   * and receives the wav audio data as a blob.
   * It creates an <audio>element for playback in the browser 
   * and an <a>link for downloading the pcm audio as a .wav file.
   */
  function createDownloadLink(blob) {
    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    var li = document.createElement('li');
    var link = document.createElement('a');
    //name of the .wav file
    var filename = new Date().toISOString();

    //add controls to <audio>
    au.controls = true;
    au.src = url;

    //save to disk
    link.href = url;
    link.download = filename+".wav"; //download forces the browser to download the file using the  filename
    link.innerHTML = "Save to disk";
    // add the new audio element
    li.appendChild(au);
    li.appendChild(document.createTextNode(filename+".wav "))
    li.appendChild(link);
    //upload link
    var upload = document.createElement('a');
    upload.href="#";
    upload.innerHTML = "Upload";
    upload.addEventListener("click", function(event){
      var xhr=new XMLHttpRequest();
      xhr.onload=function(e) {
        if(this.readyState === 4) {
          console.log("Server returned: ",e.target.responseText);
        }
      };
      var fd = new FormData();
      fd.append("audio_data",blob, filename);
      xhr.open("POST","upload.php",true);
      xhr.send(fd);
    })
    li.appendChild(document.createTextNode(" "))//add a space in between
    li.appendChild(upload)//add the upload link to li

    recordingsList.appendChild(li);
}
                                                                                                
