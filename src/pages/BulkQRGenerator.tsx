import React, { useState } from 'react'
import { DashboardLayout } from '../components/DashboardLayout'
import { Download, Grid3X3, Trash2, Eye, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const BulkQRGenerator: React.FC = () => {
  const navigate = useNavigate()
  const [urls, setUrls] = useState('')
  const [qrCodes, setQrCodes] = useState<Array<{ url: string; qrUrl: string }>>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState('png')
  const [downloadSize, setDownloadSize] = useState('200')

  const generateBulkQRCodes = async () => {
    if (!urls.trim()) return

    setIsGenerating(true)
    try {
      const urlList = urls.split('\n').filter(url => url.trim())
      const generatedQRs = urlList.map(url => ({
        url: url.trim(),
        qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url.trim())}`
      }))
      
      setQrCodes(generatedQRs)
    } catch (error) {
      console.error('Error generating QR codes:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadAllQRCodes = async () => {
    if (qrCodes.length === 0) return

    for (let i = 0; i < qrCodes.length; i++) {
      const qr = qrCodes[i]
      try {
        const downloadUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${downloadSize}x${downloadSize}&format=${downloadFormat}&data=${encodeURIComponent(qr.url)}`
        
        const response = await fetch(downloadUrl)
        const blob = await response.blob()
        
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `qrcode-${i + 1}.${downloadFormat}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(link.href)
        
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        console.error(`Error downloading QR code ${i + 1}:`, error)
      }
    }
  }

  const downloadSingleQR = async (qr: { url: string; qrUrl: string }, index: number) => {
    try {
      const downloadUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${downloadSize}x${downloadSize}&format=${downloadFormat}&data=${encodeURIComponent(qr.url)}`
      
      const response = await fetch(downloadUrl)
      const blob = await response.blob()
      
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `qrcode-${index + 1}.${downloadFormat}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
    } catch (error) {
      console.error('Error downloading QR code:', error)
    }
  }

  const clearAll = () => {
    setUrls('')
    setQrCodes([])
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate('/generate')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Single QR
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Grid3X3 className="w-6 h-6 mr-3 text-yellow-600" />
            Bulk QR Code Generator
          </h1>
          <p className="text-gray-600">Generate multiple QR codes at once by entering URLs on separate lines.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Enter Your URLs</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="urls" className="block text-sm font-medium text-gray-700 mb-2">
                    URLs (one per line)
                  </label>
                  <textarea
                    id="urls"
                    value={urls}
                    onChange={(e) => setUrls(e.target.value)}
                    placeholder={`https://example.com
https://google.com
https://github.com
https://linkedin.com`}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Enter each URL on a new line. You can add up to 50 URLs at once.
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={generateBulkQRCodes}
                    disabled={!urls.trim() || isGenerating}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    {isGenerating ? 'Generating...' : 'Generate QR Codes'}
                  </button>
                  
                  {qrCodes.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Download Options */}
            {qrCodes.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Download Options</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                      <select
                        value={downloadFormat}
                        onChange={(e) => setDownloadFormat(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      >
                        <option value="png">PNG</option>
                        <option value="jpg">JPG</option>
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
                        <option value="1000">1000x1000 px</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={downloadAllQRCodes}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download All QR Codes ({qrCodes.length})
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated QR Codes</h3>
              
              {qrCodes.length === 0 ? (
                <div className="flex items-center justify-center min-h-[300px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <Grid3X3 className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">Enter URLs and click generate to see your QR codes</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {qrCodes.map((qr, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <img
                          src={qr.qrUrl}
                          alt={`QR Code ${index + 1}`}
                          className="w-16 h-16 rounded border border-gray-200"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          QR Code #{index + 1}
                        </p>
                        <p className="text-xs text-gray-500 truncate" title={qr.url}>
                          {qr.url}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.open(qr.url, '_blank')}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Preview URL"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadSingleQR(qr, index)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Download QR Code"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {qrCodes.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Grid3X3 className="w-5 h-5 text-blue-600 mt-0.5" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800">Bulk Generation Complete</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Successfully generated {qrCodes.length} QR codes. You can download them individually or all at once.
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