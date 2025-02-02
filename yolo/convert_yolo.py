import os
import shutil
from ultralytics import YOLO
import onnx
import subprocess

# Define file paths
MODEL_PT = "yolov8s.pt"
MODEL_ONNX = "yolov8s.onnx"
MODEL_TF_DIR = "yolov8s_tf"
MODEL_TFJS_DIR = "yolov8s_web"

def convert_to_onnx():
    """Convert YOLOv8 PyTorch model to ONNX."""
    print("Converting YOLOv8 PyTorch model to ONNX...")
    model = YOLO(MODEL_PT)
    model.export(format="onnx")
    print(f"ONNX model saved as {MODEL_ONNX}")

def convert_to_tensorflow():
    """Convert ONNX model to TensorFlow SavedModel format."""
    print("Converting ONNX model to TensorFlow...")
    subprocess.run(["onnx2tf", "-i", MODEL_ONNX, "-o", MODEL_TF_DIR], check=True)
    print(f"TensorFlow model saved in {MODEL_TF_DIR}")

def convert_to_tensorflowjs():
    """Convert TensorFlow model to TensorFlow.js format."""
    print("Converting TensorFlow model to TensorFlow.js...")
    subprocess.run([
        "tensorflowjs_converter",
        "--input_format=tf_saved_model",
        "--output_format=tfjs_graph_model",
        MODEL_TF_DIR,
        MODEL_TFJS_DIR
    ], check=True)
    print(f"TensorFlow.js model saved in {MODEL_TFJS_DIR}")

def move_to_public_folder():
    """Move TensorFlow.js model to Next.js public directory."""
    public_path = os.path.join("public", MODEL_TFJS_DIR)
    
    if os.path.exists(public_path):
        shutil.rmtree(public_path)
    
    shutil.move(MODEL_TFJS_DIR, public_path)
    print(f"Model moved to {public_path}")

if __name__ == "__main__":
    convert_to_onnx()
    convert_to_tensorflow()
    convert_to_tensorflowjs()
    move_to_public_folder()
    print("✅ All conversions completed successfully!")
