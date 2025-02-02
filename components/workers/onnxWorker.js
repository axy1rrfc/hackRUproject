// components/workers/onnxWorker.js

onmessage = async function (e) {
  if (e.data === 'loadModel') {
    try {
      // Load the ONNX model asynchronously here
      const loadedModel = await tf.loadGraphModel('/models/yolov8s.onnx');
      postMessage(model);  // Send the loaded model back to the main thread
    } catch (err) {
      postMessage(null);  // If error, send null to indicate failure
    }
  }
};
