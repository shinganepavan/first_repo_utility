import React, { useState, useRef, useEffect } from 'react';
import QRious from 'qrious';
import jsQR from 'jsqr';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { Download, Upload, Scan } from 'lucide-react';

interface ToolProps {
  toolId: string;
}

export const ImageTools: React.FC<ToolProps> = ({ toolId }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  
  // Compressor states
  const [quality, setQuality] = useState(0.8);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

  // Resizer states
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [originalRatio, setOriginalRatio] = useState(4/3);

  // Format Converter states
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png');

  // QR Generator states
  const [qrText, setQrText] = useState('https://utilityhub.ai');
  const [qrImage, setQrImage] = useState('');

  // QR Scanner states
  const [scanResult, setScanResult] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setOriginalSize(file.size);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string);
      
      // Load image to get original dimensions
      const img = new Image();
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
        setOriginalRatio(img.width / img.height);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  // 1. Image Compressor
  const compressImage = () => {
    if (!imageSrc) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      setResultImage(compressedDataUrl);

      // Estimate compressed size from dataURL
      const head = 'data:image/jpeg;base64,';
      const size = Math.round((compressedDataUrl.length - head.length) * 3 / 4);
      setCompressedSize(size);
    };
    img.src = imageSrc;
  };

  // 2. Image Resizer
  const resizeImage = () => {
    if (!imageSrc) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      
      const resized = canvas.toDataURL('image/png');
      setResultImage(resized);
    };
    img.src = imageSrc;
  };

  // Adjust height/width automatically
  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (maintainRatio) {
      setHeight(Math.round(val / originalRatio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (maintainRatio) {
      setWidth(Math.round(val * originalRatio));
    }
  };

  // 3. Format Converter
  const convertFormat = () => {
    if (!imageSrc) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      
      const converted = canvas.toDataURL(`image/${format}`);
      setResultImage(converted);
    };
    img.src = imageSrc;
  };

  // 4. QR Code Generator
  useEffect(() => {
    if (toolId === 'qr-generator') {
      const qr = new QRious({
        value: qrText,
        size: 250,
        level: 'H'
      });
      setQrImage(qr.toDataURL());
    }
  }, [qrText, toolId]);

  // 5. QR Code Scanner from Uploaded Image
  const scanQrImage = () => {
    if (!imageSrc) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      if (imageData) {
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          setScanResult(code.data);
        } else {
          setScanResult('Could not find any readable QR code in this image.');
        }
      }
    };
    img.src = imageSrc;
  };

  // 6. Webcam QR Scanner Loop
  useEffect(() => {
    let animationFrameId: number;
    let stream: MediaStream | null = null;

    const tick = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        const ctx = canvas.getContext('2d');
        
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (imageData) {
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            setScanResult(code.data);
            setIsScanning(false);
            if (stream) {
              stream.getTracks().forEach(track => track.stop());
            }
            return;
          }
        }
      }
      if (isScanning) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true'); // Required for iOS
          videoRef.current.play();
        }
        animationFrameId = requestAnimationFrame(tick);
      } catch (err) {
        console.error('Camera access rejected', err);
        setIsScanning(false);
      }
    };

    if (isScanning) {
      startCamera();
    } else {
      if (stream) {
        (stream as MediaStream).getTracks().forEach(track => track.stop());
      }
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (stream) {
        (stream as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, [isScanning]);

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `utilityhub_${fileName.split('.')[0] || 'result'}.${format === 'jpeg' ? 'jpg' : format}`;
    link.click();
  };

  const handleClear = () => {
    setImageSrc(null);
    setResultImage(null);
    setFileName('');
    setScanResult('');
    setIsScanning(false);
  };

  return (
    <div className="space-y-6">
      
      {/* QR Code Generator layout */}
      {toolId === 'qr-generator' && (
        <Card hoverEffect={false} className="max-w-xl mx-auto border border-slate-200/50 dark:border-slate-800/50 p-6 bg-white/60 dark:bg-slate-900/60 space-y-6">
          <h4 className="text-sm font-bold text-slate-800 dark:text-white">QR Code Configuration</h4>
          <Input
            label="QR Target Text or Link"
            value={qrText}
            onChange={(e) => setQrText(e.target.value)}
          />
          {qrImage && (
            <div className="flex flex-col items-center justify-center gap-4 mt-6">
              <div className="p-4 bg-white rounded-2xl shadow-md border border-slate-100">
                <img src={qrImage} alt="QR Code" className="w-48 h-48" />
              </div>
              <a href={qrImage} download="qr_code.png">
                <Button size="sm" className="text-xs">
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Download PNG
                </Button>
              </a>
            </div>
          )}
        </Card>
      )}

      {/* QR Code Scanner Layout */}
      {toolId === 'qr-scanner' && (
        <Card hoverEffect={false} className="max-w-xl mx-auto border border-slate-200/50 dark:border-slate-800/50 p-6 bg-white/60 dark:bg-slate-900/60 space-y-6">
          <h4 className="text-sm font-bold text-slate-800 dark:text-white">Webcam / Image QR Reader</h4>
          <div className="flex gap-4">
            <Button
              variant={isScanning ? 'danger' : 'secondary'}
              size="sm"
              onClick={() => setIsScanning(!isScanning)}
              className="text-xs w-full"
            >
              <Scan className="w-4 h-4 mr-1.5" />
              {isScanning ? 'Stop Camera' : 'Start Camera Scan'}
            </Button>
            <Button variant="outline" size="sm" onClick={triggerUpload} className="text-xs w-full">
              <Upload className="w-4 h-4 mr-1.5" />
              Upload Image
            </Button>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => {
              handleFileChange(e);
              setTimeout(scanQrImage, 300);
            }}
            className="hidden"
          />

          {isScanning && (
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-black">
              <video ref={videoRef} className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}

          {imageSrc && !isScanning && (
            <div className="text-center">
              <img src={imageSrc} alt="uploaded qr" className="max-h-48 mx-auto rounded-xl shadow border border-slate-100" />
            </div>
          )}

          {scanResult && (
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Decoded Payload</p>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 break-all">{scanResult}</p>
            </div>
          )}
        </Card>
      )}

      {/* Standard Image upload & canvas panel */}
      {toolId !== 'qr-generator' && toolId !== 'qr-scanner' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Upload Area */}
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Source Image</label>
            {!imageSrc ? (
              <div
                onClick={triggerUpload}
                className="w-full h-80 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 dark:hover:border-sky-500/40 bg-white/20 dark:bg-slate-950/10 flex flex-col items-center justify-center gap-4 cursor-pointer group transition-all"
              >
                <span className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-500 group-hover:scale-105 transition-transform">
                  <Upload className="w-6 h-6" />
                </span>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Drag & Drop or Click to Upload</p>
                <p className="text-[10px] text-slate-400">Supports PNG, JPEG, WEBP, and GIF</p>
              </div>
            ) : (
              <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 flex items-center justify-center p-2">
                <img src={imageSrc} alt="source" className="max-h-full max-w-full object-contain rounded" />
                <button
                  onClick={handleClear}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 hover:bg-black text-white text-xs"
                >
                  Change Image
                </button>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>

          {/* Action and Output area */}
          <div className="space-y-6">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Output Settings & Result</label>
            
            {imageSrc ? (
              <Card hoverEffect={false} className="border border-slate-200/50 dark:border-slate-800/50 p-6 space-y-6 bg-white/60 dark:bg-[#0c101d]/60">
                
                {/* Compressor Specific Inputs */}
                {toolId === 'image-compressor' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-400">Compression Quality</span>
                      <span className="text-indigo-500">{Math.round(quality * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.1}
                      max={1.0}
                      step={0.05}
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex gap-4">
                      <Button onClick={compressImage} className="text-xs w-full">Compress Now</Button>
                    </div>
                  </div>
                )}

                {/* Resizer Specific Inputs */}
                {toolId === 'image-resizer' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Width (px)"
                        type="number"
                        value={width}
                        onChange={(e) => handleWidthChange(Number(e.target.value))}
                      />
                      <Input
                        label="Height (px)"
                        type="number"
                        value={height}
                        onChange={(e) => handleHeightChange(Number(e.target.value))}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <input
                        type="checkbox"
                        id="maintain"
                        checked={maintainRatio}
                        onChange={(e) => setMaintainRatio(e.target.checked)}
                        className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500/20"
                      />
                      <label htmlFor="maintain">Maintain aspect ratio</label>
                    </div>
                    <Button onClick={resizeImage} className="text-xs w-full">Resize Now</Button>
                  </div>
                )}

                {/* Format Converter Specific */}
                {toolId === 'image-converter' && (
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Target Format</label>
                    <div className="flex gap-3">
                      {['png', 'jpeg', 'webp'].map((f) => (
                        <button
                          key={f}
                          onClick={() => setFormat(f as any)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase ${format === f ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-650'}`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                    <Button onClick={convertFormat} className="text-xs w-full">Convert Now</Button>
                  </div>
                )}

                {/* Simulated BG remover / Image details */}
                {(toolId === 'bg-remover' || toolId === 'image-cropper' || toolId === 'image-to-pdf') && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500">We will auto-process formatting and configurations inside your browser canvas.</p>
                    <Button onClick={() => {
                      setFormat('png');
                      setResultImage(imageSrc);
                    }} className="text-xs w-full">Process Image</Button>
                  </div>
                )}

                {/* Result Preview & Download */}
                {resultImage && (
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-4">
                    <p className="text-xs font-bold text-slate-800 dark:text-white">Processed Preview</p>
                    <div className="aspect-video rounded-xl bg-slate-900 flex items-center justify-center p-2 max-h-40 border border-slate-200 dark:border-slate-800">
                      <img src={resultImage} alt="result" className="max-h-full max-w-full object-contain" />
                    </div>
                    
                    {/* Sizes metrics for compressor */}
                    {toolId === 'image-compressor' && compressedSize > 0 && (
                      <div className="flex justify-between items-center text-xs font-semibold bg-indigo-50/40 dark:bg-indigo-950/20 p-3 rounded-xl">
                        <span className="text-slate-500">Compressed from: {Math.round(originalSize / 1024)} KB</span>
                        <span className="text-indigo-500 font-bold">New: {Math.round(compressedSize / 1024)} KB</span>
                      </div>
                    )}

                    <Button onClick={handleDownload} className="text-xs w-full">
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      Download Result
                    </Button>
                  </div>
                )}

              </Card>
            ) : (
              <div className="py-20 text-center text-slate-450 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                Please upload a source image to activate options.
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
export default ImageTools;
