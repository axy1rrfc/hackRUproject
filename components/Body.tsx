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
    <div className="relative w-full min-h-screen bg-custom flex flex-col items-center justify-center p-6 bg-fixed">
      <div className="absolute inset-0 bg-green-900 opacity-75"></div>
    <div className="relative z-10 flex flex-col items-center justify-center">
    <div className="flex justify-center items-center flex-col w-full lg:p-0 p-4 sm:mb-28 mb-0">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mt-10">
        <div className="col-span-1">
          <h1 className="text-3xl font-bold mb-10">Generate a QR Code</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input placeholder="roomgpt.io" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is what your QR code will link to.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A city view with clouds"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="">
                        This is what the image in your QR code will look like.
                      </FormDescription>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="my-2">
                  <p className="text-sm font-medium mb-3">Prompt suggestions</p>
                  <div className="grid sm:grid-cols-2 grid-cols-1 gap-3 text-center text-gray-500 text-sm">
                    {promptSuggestions.map((suggestion) => (
                      <PromptSuggestion
                        key={suggestion}
                        suggestion={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                        isLoading={isLoading}
                      />
                    ))}
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center
                 max-w-[200px] mx-auto w-full"
                >
                  {isLoading ? (
                    <LoadingDots color="white" />
                  ) : response ? (
                    '✨ Regenerate'
                  ) : (
                    'Generate'
                  )}
                </Button>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            </form>
          </Form>
        </div>
        <div className="col-span-1">
          {submittedURL && (
            <>
              <h1 className="text-3xl font-bold sm:mb-5 mb-5 mt-5 sm:mt-0 sm:text-center text-left">
                Your QR Code
              </h1>
              <div>
                <div className="flex flex-col justify-center relative h-auto items-center">
                  {response ? (
                    <QrCard
                      imageURL={response.image_url}
                      time={(response.model_latency_ms / 1000).toFixed(2)}
                    />
                  ) : (
                    <div className="relative flex flex-col justify-center items-center gap-y-2 w-[510px] border border-gray-300 rounded shadow group p-2 mx-auto animate-pulse bg-gray-400 aspect-square max-w-full" />
                  )}
                </div>
                {response && (
                  <div className="flex justify-center gap-5 mt-4">
                    <Button
                      onClick={() =>
                        downloadQrCode(response.image_url, 'qrCode')
                      }
                    >
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `https://qrgpt.io/start/${id || ''}`,
                        );
                        toast.success('Link copied to clipboard');
                      }}
                    >
                      ✂️ Share
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <Toaster />
    </div>
    </div>
    </div>
  );
};

export default Body;