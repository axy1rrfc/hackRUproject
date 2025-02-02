from ultralytics import YOLO
import numpy as np
import cv2

# Load YOLO model (use yolov8n.pt or any other model)
model = YOLO("yolov8n.pt")

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
