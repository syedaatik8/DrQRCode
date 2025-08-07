import React, { useState } from 'react'
import { DashboardLayout } from '../components/DashboardLayout'
import { Download, Link as LinkIcon, Crown, Grid3X3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const QRGenerator: React.FC = () => {
  const navigate = useNavigate()
  const [url, setUrl] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState('png')
  const [downloadSize, setDownloadSize] = useState('200')

  const generateQRCode = async () => {
    if (!url.trim()) return

    setIsGenerating(true)
    try {
      // Using QR Server API for QR code generation
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}`
      setQrCode(qrUrl)
    } catch (error) {
      console.error('Error generating QR code:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadQRCode = async (format: string, size: string) => {
    if (!qrCode) return

    try {
      const downloadUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&format=${format}&data=${encodeURIComponent(url)}`
      
      const response = await fetch(downloadUrl)
      const blob = await response.blob()
      
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `qrcode.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
    } catch (error) {
      console.error('Error downloading QR code:', error)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Generate QR Code</h1>
          <p className="text-gray-600">Create QR codes for your URLs, text, or other content.</p>
          <div className="mt-4">
            <button
              onClick={() => navigate('/bulk-qr')}
              className="inline-flex items-center px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Generate Bulk QR Codes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Input */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Enter Your Content</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                    <LinkIcon className="w-4 h-4 inline mr-2" />
                    URL or Text
                  </label>
                  <input
                    id="url"
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com or any text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors"
                  />
                </div>

                <button
                  onClick={generateQRCode}
                  disabled={!url.trim() || isGenerating}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  {isGenerating ? 'Generating...' : 'Generate QR Code'}
                </button>
              </div>
            </div>

            {/* Download Options */}
            {qrCode && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Download Options</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                    <select
                      value={downloadFormat}
                      onChange={(e) => setDownloadFormat(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    >
                      <option value="png">PNG</option>
                      <option value="jpg">JPG</option>
                      <option value="svg" className="text-yellow-600">
                        SVG (Premium)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                    <select
                      value={downloadSize}
                      onChange={(e) => setDownloadSize(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    >
                      <option value="200">200x200 px</option>
                      <option value="500">500x500 px</option>
                      <option value="1000">1000x1000 px (Premium)</option>
                    </select>
                  </div>

                  <button
                    onClick={() => downloadQRCode(downloadFormat, downloadSize)}
                    disabled={downloadFormat === 'svg' || downloadSize === '1000'}
                    className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {(downloadFormat === 'svg' || downloadSize === '1000') ? (
                      <>
                        <Crown className="w-4 h-4 mr-1" />
                        Upgrade to Premium
                      </>
                    ) : (
                      'Download QR Code'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
              
              <div className="flex items-center justify-center min-h-[300px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                {qrCode ? (
                  <div className="text-center p-6">
                    <img
                      src={qrCode}
                      alt="Generated QR Code"
                      className="mx-auto mb-4 rounded-lg shadow-sm"
                      style={{ maxWidth: '300px', maxHeight: '300px' }}
                    />
                    <p className="text-sm text-gray-600">QR Code generated successfully!</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <LinkIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">Enter a URL and click generate to see your QR code</p>
                  </div>
                )}
              </div>
            </div>

            {qrCode && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Crown className="w-5 h-5 text-yellow-600 mt-0.5" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-yellow-800">Upgrade to Premium</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Get access to SVG format, high-resolution downloads, custom colors, and advanced analytics.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}