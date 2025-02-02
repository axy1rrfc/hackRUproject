import io
import numpy as np
from PIL import Image
import yolov5  # Example if you are using YOLOv5

def detect_objects(image_bytes):
    # Load image using PIL
    image = Image.open(io.BytesIO(image_bytes))

    # Process the image using YOLO model (YOLOv5 is an example)
    model = yolov5.load("yolov5s.pt")  # Load your model (adjust the path)
    results = model(image)

    # Parse the results and return a structured response
    detections = []
    for idx, (*xyxy, conf, cls) in enumerate(results.xywh[0]):  # YOLO output format
        detection = {
            "class": results.names[int(cls)],
            "confidence": conf.item(),
            "bbox": [xyxy[0].item(), xyxy[1].item(), xyxy[2].item(), xyxy[3].item()]
        }
        detections.append(detection)

    return detections
