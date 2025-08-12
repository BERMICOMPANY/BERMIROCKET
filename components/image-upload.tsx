"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  bucket?: string
  maxSize?: number // in MB
  accept?: string
  className?: string
}

export function ImageUpload({
  onImageUploaded,
  bucket = "product-images",
  maxSize = 5,
  accept = "image/*",
  className = "",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`)
      return
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to Supabase
    await uploadImage(file)
  }

  const uploadImage = async (file: File) => {
    try {
      setUploading(true)
      setUploadProgress(0)

      const supabase = createClient()

      // Generate unique filename
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${fileName}`

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 100)

      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (error) {
        throw error
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(filePath)

      onImageUploaded(publicUrl)
      toast.success("Image uploaded successfully!")
    } catch (error: any) {
      console.error("Upload error:", error)
      toast.error(error.message || "Failed to upload image")
      setPreview(null)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const removeImage = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={className}>
      <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileSelect} className="hidden" />

      {preview ? (
        <Card className="relative">
          <CardContent className="p-4">
            <div className="relative">
              <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
              <Button
                variant="destructive"
                size="sm"
                onClick={removeImage}
                className="absolute top-2 right-2 h-8 w-8 p-0"
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {uploading && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card
          className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Upload Image</h3>
                <p className="text-sm text-muted-foreground mt-1">Click to select or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">Max size: {maxSize}MB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
