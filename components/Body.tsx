'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

const generateFormSchema = z.object({
  prompt: z.string().min(3).max(160),
});

type GenerateFormValues = z.infer<typeof generateFormSchema>;

const Body = ({ prompt }: { prompt?: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [detections, setDetections] = useState<any[]>([]);

  const form = useForm<GenerateFormValues>({
    resolver: zodResolver(generateFormSchema),
    mode: 'onChange',
    defaultValues: {
      prompt: prompt || '',
    },
  });

  // Capture frame and send to Flask API for object detection
  const captureFrameAndDetect = useCallback(async () => {
    const videoElement = document.getElementById('webcam-feed') as HTMLImageElement;
    if (!videoElement) return;

    try {
      // Capture image from the video feed
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      ctx?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      // Get the base64-encoded image data
      const imageData = canvas.toDataURL('image/jpeg');

      // Send the image data to the Flask API for object detection
      const response = await fetch('http://localhost:5005/detect', {
        method: 'POST',
        body: JSON.stringify({ image: imageData }), // Send base64-encoded image data
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setDetections(data);
    } catch (err) {
      console.error('Error detecting objects:', err);
      toast.error('Failed to detect objects');
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      captureFrameAndDetect();
    }, 2000); // Detect every 2 seconds
    return () => clearInterval(interval);
  }, [captureFrameAndDetect]);

  // Function to draw bounding boxes on the canvas
  const drawDetections = () => {
    const canvas = document.getElementById('webcam-canvas') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings

    detections.forEach((detection) => {
      const [x1, y1, x2, y2] = detection.bbox;
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 3;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
      ctx.fillStyle = 'red';
      ctx.font = '16px Arial';
      ctx.fillText(`${detection.class} (${Math.round(detection.confidence * 100)}%)`, x1, y1 - 10);
    });
  };

  useEffect(() => {
    drawDetections();
  }, [detections]);

  return (
    <div className="flex justify-center items-center flex-col w-full lg:p-0 p-4 sm:mb-28 mb-0">
      <Form {...form}>
        <form className="flex flex-col gap-4">
          <FormField control={form.control} name="prompt" render={({ field }) => (
            <FormItem>
              <FormLabel>Prompt</FormLabel>
              <FormControl><Textarea placeholder="A city view with clouds" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="submit" disabled={isLoading}>{isLoading ? 'Loading...' : 'Generate'}</Button>
          {error && <div className="text-red-500">{error.message}</div>}
        </form>
      </Form>
      
      {/* Webcam Feed */}
      <div className="webcam-container mt-4 w-full max-w-xl border border-gray-300 rounded-lg relative">
        <img
          id="webcam-feed"
          src="http://localhost:5005/video_feed"  // Adjusted to point to Flask backend
          alt="Webcam Stream"
          className="w-full"
        />
        <canvas
          id="webcam-canvas"
          className="absolute top-0 left-0 w-full h-full"
          style={{ pointerEvents: 'none' }}
        />
      </div>

      <Toaster />
    </div>
  );
};

export default Body;