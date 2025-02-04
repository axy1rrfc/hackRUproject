'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';
import { X } from 'lucide-react';

const generateFormSchema = z.object({
  prompt: z.string().min(3).max(160),
  image: z.instanceof(File).optional(),
});

type GenerateFormValues = z.infer<typeof generateFormSchema>;

const Body = ({ prompt }: { prompt?: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [detections, setDetections] = useState<any[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page refresh

    console.log('Selected Allergies:', selectedAllergies);

    const formData = {
      allergies: selectedAllergies, // Store selected allergies
    };

    console.log('Form Submitted:', formData); // Debugging - Check the array

    // (Optional) Send data to backend
    // fetch('/api/submit', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData),
    // });
  };
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file); // Append the file to the form data

    try {
      const response = await fetch('http://localhost:5005/detect', {
        method: 'POST',
        body: formData, // Send FormData
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setDetections(data);
      toast.success('Image processed successfully!');
    } catch (err) {
      console.error('Error detecting objects:', err);
      toast.error('Failed to detect objects');
    }
  };

  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);

  const handleSelect = (value: string) => {
    if (!selectedAllergies.includes(value)) {
      setSelectedAllergies([...selectedAllergies, value]);
    }
  };

  const removeAllergy = (value: string) => {
    setSelectedAllergies(
      selectedAllergies.filter((allergy) => allergy !== value),
    );
  };
  const form = useForm<GenerateFormValues>({
    resolver: zodResolver(generateFormSchema),
    mode: 'onChange',
    defaultValues: {
      prompt: prompt || '',
    },
  });

  // Capture frame and send to Flask API for object detection
  const captureFrameAndDetect = useCallback(async () => {
    const videoElement = document.getElementById(
      'webcam-feed',
    ) as HTMLImageElement;
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
    const canvas = document.getElementById(
      'webcam-canvas',
    ) as HTMLCanvasElement;
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
      ctx.fillText(
        `${detection.class} (${Math.round(detection.confidence * 100)}%)`,
        x1,
        y1 - 10,
      );
    });
  };

  useEffect(() => {
    drawDetections();
  }, [detections]);

  return (
    <div className="relative w-full min-h-screen bg-custom flex flex-col items-center justify-center p-6 bg-fixed">
      <div className="absolute z-0 inset-0 bg-green-900 opacity-75"></div>
      <div className="flex z-10 justify-center items-center flex-col w-full lg:p-0 p-4 sm:mb-28 mb-0">
        {/* Form Section */}
        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Upload Image Field */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-green-700 font-bold bg-yellow-500 px-3 py-1 rounded-lg">
                    Upload Image:
                  </FormLabel>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        field.onChange(file); // Update form state with file
                      }
                    }}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Allergy Dropdown */}
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-green-700 font-bold bg-yellow-500 px-3 py-1 rounded-lg">
                    Select Allergies:
                  </FormLabel>
                  <Select onValueChange={(value) => field.onChange(value)}>
                    <SelectTrigger className="flex items-center justify-between w-full px-3 py-2 text-green-700 font-bold bg-yellow-500">
                      <SelectValue placeholder="Select an allergy" />
                      <ChevronDown className="h-4 w-4 color-green-700 opacity-80" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      className="max-h-80 overflow-y-auto text-green-700 font-bold bg-yellow-500 z-10"
                    >
                      {[
                        'peanuts',
                        'milk',
                        'gluten',
                        'shellfish',
                        'soy',
                        'eggs',
                        'tree-nuts',
                        'wheat',
                        'fish',
                        'corn',
                        'sesame',
                        'mustard',
                        'celery',
                        'sulfites',
                        'lupin',
                        'banana',
                        'broccoli',
                        'coconut',
                        'rice',
                        'oats',
                        'garlic',
                        'onion',
                        'chocolate',
                        'caffeine',
                        'yeast',
                        'msg',
                        'kiwi',
                      ].map((allergy) => (
                        <SelectItem
                          key={allergy}
                          value={allergy}
                          className="hover:bg-green-700"
                        >
                          {allergy.charAt(0).toUpperCase() + allergy.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Selected Allergies List */}
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedAllergies.map((allergy) => (
                <div
                  key={allergy}
                  className="flex items-center bg-gray-200 px-3 py-1 rounded-lg"
                >
                  <span>{allergy}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAllergy(allergy)}
                    className="ml-2 text-red-500"
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Submit Allergies'}
            </Button>

            {/* Error Message */}
            {error && <div className="text-red-500">{error.message}</div>}
          </form>
        </Form>

        {/* Webcam Feed */}
        <div className="webcam-container mt-8 w-full max-w-xl border border-8 border-yellow-500 rounded-lg relative">
          <img
            id="webcam-feed"
            src="http://localhost:5005/video_feed" // Adjusted to point to Flask backend
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
    </div>
  );
};

export default Body;
