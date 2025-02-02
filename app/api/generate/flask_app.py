#flask_app.py
from flask import Flask, Response, request, jsonify
from flask_cors import CORS
import cv2
import base64
import numpy as np
from ultralytics import YOLO

app = Flask(__name__)
CORS(app, resources={r"/video_feed": {"origins": "http://localhost:3000"}})  # Allow CORS for the video feed route

# Load YOLOv8 model (use yolov8n.pt or any other model)
model = YOLO("public/yolov8s.pt")  # Ensure the path to the model is correct

# OpenCV Video Capture
camera = cv2.VideoCapture(0)  # Change index if needed

def detect_objects(frame):
    """
    Runs YOLO object detection on a single video frame.
    :param frame: OpenCV image frame.
    :return: Frame with bounding boxes and class labels.
    """
    results = model(frame)  # Run YOLO inference

    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])  # Bounding box coordinates
            confidence = float(box.conf[0])  # Confidence score
            class_id = int(box.cls[0])  # Class ID
            class_name = model.names[class_id]  # Get class label

            # Draw bounding box and label
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, f"{class_name} {confidence:.2f}", (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    return frame

# Route for Streaming Video
@app.route('/video_feed')
def video_feed():
    def generate():
        while True:
            success, frame = camera.read()
            if not success:
                break

            # Perform object detection on the frame
            frame_with_detections = detect_objects(frame)

            # Encode the frame with detections as JPEG
            _, buffer = cv2.imencode('.jpg', frame_with_detections)
            frame_bytes = buffer.tobytes()

            # Yield the frame to be streamed
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

# Route for Object Detection (Mock Response)
@app.route('/detect', methods=['POST'])
def detect_objects_route():
    data = request.json.get('image')
    if not data:
        return jsonify({"error": "No image provided"}), 400

    # Decode base64 image
    image_data = base64.b64decode(data.split(',')[1])
    nparr = np.frombuffer(image_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Perform inference with YOLOv8
    frame_with_detections = detect_objects(img)

    # Encode the processed frame as base64
    _, buffer = cv2.imencode('.jpg', frame_with_detections)
    img_bytes = base64.b64encode(buffer.tobytes()).decode('utf-8')

    return jsonify({"image": f"data:image/jpeg;base64,{img_bytes}"})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005, debug=True)