from ultralytics import YOLO
import numpy as np
import cv2
import io

# Load YOLOv8 model
model = YOLO("yolov8s.pt")  # You can replace with a different model file

def detect_objects(image_bytes):
    """
    Runs YOLO object detection on an image.
    
    :param image_bytes: Image data in bytes.
    :return: List of detected objects with bounding boxes and confidence scores.
    """
    try:
        # Convert bytes to OpenCV image
        image_array = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

        # Run YOLO inference
        results = model(image)

        detections = []
        for result in results:
            for box in result.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])  # Bounding box coordinates
                confidence = float(box.conf[0])  # Confidence score
                class_id = int(box.cls[0])  # Class ID
                class_name = model.names[class_id]  # Get class label

                detections.append({
                    "class": class_name,
                    "confidence": confidence,
                    "bbox": [x1, y1, x2, y2]
                })

        return detections

    except Exception as e:
        return {"error": str(e)}
