"use client";
import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";

const YoloDetector: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [model, setModel] = useState<tf.GraphModel | null>(null);

  // Load the YOLO model
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log("Loading YOLO model...");
        const yoloModel = await tf.loadGraphModel("/yolo/model.json"); 
        setModel(yoloModel);
        console.log("Model loaded successfully!");
      } catch (error) {
        console.error("Error loading YOLO model:", error);
      }
    };

    loadModel();
  }, []);

  // Function to run detection
  const runDetection = async () => {
    if (!model || !videoRef.current) return;

    const video = videoRef.current;
    const tensor = tf.browser.fromPixels(video).expandDims(0).toFloat();

    const predictions = await model.predict(tensor) as tf.Tensor;
    console.log("Predictions:", await predictions.data());
    
    tensor.dispose();
    predictions.dispose();
  };

  return (
    <div>
      <h2>YOLOv8 Object Detection</h2>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        width="640"
        height="480"
      />
      <button onClick={runDetection}>Run Detection</button>
    </div>
  );
};

export default YoloDetector;
