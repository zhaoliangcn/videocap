const { ipcRenderer } = require('electron');

const recordBtn = document.getElementById('recordBtn');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const recordIcon = document.querySelector('.record-icon');
const recordText = document.querySelector('.record-text');
const minimizeBtn = document.getElementById('minimizeBtn');
const closeBtn = document.getElementById('closeBtn');

let isRecording = false;
let mediaRecorder = null;
let recordedChunks = [];
let stream = null;

recordBtn.addEventListener('click', () => {
  ipcRenderer.send('toggle-recording');
});

minimizeBtn.addEventListener('click', () => {
  ipcRenderer.send('minimize-window');
});

closeBtn.addEventListener('click', () => {
  ipcRenderer.send('close-window');
});

async function startRecording() {
  try {
    const sources = await ipcRenderer.invoke('get-screen-sources');

    if (sources.length === 0) {
      ipcRenderer.send('recording-error', '未找到可用的屏幕源');
      return;
    }

    const screenSource = sources[0];
    
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: screenSource.id,
          minWidth: 1280,
          maxWidth: 1920,
          minHeight: 720,
          maxHeight: 1080
        }
      }
    });

    recordedChunks = [];
    mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9'
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const buffer = Buffer.from(await blob.arrayBuffer());
      
      const savePath = await ipcRenderer.invoke('save-recording', buffer);
      
      if (savePath) {
        ipcRenderer.send('recording-finished');
      }
      
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    };

    mediaRecorder.start();
    isRecording = true;
    
  } catch (error) {
    console.error('录制启动失败:', error);
    ipcRenderer.send('recording-error', error.message);
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    isRecording = false;
  }
}

ipcRenderer.on('start-recording', () => {
  startRecording();
});

ipcRenderer.on('stop-recording', () => {
  stopRecording();
});

ipcRenderer.on('recording-started', () => {
  statusDot.classList.add('recording');
  statusText.textContent = '录制中...';
  recordIcon.classList.add('recording');
  recordText.textContent = '停止录制';
  recordBtn.classList.add('recording');
});

ipcRenderer.on('recording-stopped', () => {
  statusDot.classList.remove('recording');
  statusText.textContent = '就绪';
  recordIcon.classList.remove('recording');
  recordText.textContent = '开始录制';
  recordBtn.classList.remove('recording');
});

ipcRenderer.on('recording-error', (event, error) => {
  statusDot.classList.remove('recording');
  statusText.textContent = '错误';
  recordIcon.classList.remove('recording');
  recordText.textContent = '开始录制';
  recordBtn.classList.remove('recording');
  alert('录制错误: ' + error);
});
