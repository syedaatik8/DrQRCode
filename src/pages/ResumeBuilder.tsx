import React, { useState, useEffect } from 'react'
import { DashboardLayout } from '../components/DashboardLayout'
import { ResumeForm } from '../components/resume/ResumeForm'
import { ResumeProgress } from '../components/resume/ResumeProgress'
import { ResumePreview } from '../components/resume/ResumePreview'
import { TemplateSelector } from '../components/resume/TemplateSelector'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { User, FileText, Save, Eye, Palette, QrCode, Download } from 'lucide-react'

interface ResumeData {
  id?: string
  qr_code_id?: string
  full_name: string
  designation: string
  email: string
  phone: string
  location: string
  profile_photo_url?: string
  summary: string
  linkedin_url: string
  github_url: string
  portfolio_url: string
}

interface ResumeSection {
  education: any[]
  experience: any[]
  certifications: any[]
  skills: any[]
}

export const ResumeBuilder: React.FC = () => {
  const { user } = useAuth()
  const [resumeData, setResumeData] = useState<ResumeData>({
    full_name: '',
    designation: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: ''
  })
  const [resumeSections, setResumeSections] = useState<ResumeSection>({
    education: [],
    experience: [],
    certifications: [],
    skills: []
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('default')
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Generate QR code URL whenever resumeData changes
  useEffect(() => {
    if (resumeData.qr_code_id && resumeData.full_name) {
      const firstName = resumeData.full_name.split(' ')[0].toLowerCase()
      const resumeUrl = `${window.location.origin}/resume/${firstName}`
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(resumeUrl)}`
      setQrCodeUrl(qrUrl)
    }
  }, [resumeData.qr_code_id, resumeData.full_name])

  useEffect(() => {
    if (user && !isInitialized) {
      loadResumeData()
    }
  }, [user, isInitialized])

  const loadResumeData = async () => {
    if (!user) return

    try {
      setLoading(true)
      
      // Get or create resume
      const { data: resumeId, error: resumeError } = await supabase
        .rpc('get_or_create_user_resume', { p_user_id: user.id })

      if (resumeError) throw resumeError

      // Load resume data
      const { data: resume, error: loadError } = await supabase
        .from('user_resumes')
        .select('*')
        .eq('id', resumeId)
        .single()

      if (loadError) throw loadError

      if (resume) {
        setResumeData({
          id: resume.id,
          qr_code_id: resume.qr_code_id,
          full_name: resume.full_name || '',
          designation: resume.designation || '',
          email: resume.email || user.email || '',
          phone: resume.phone || '',
          location: resume.location || '',
          profile_photo_url: resume.profile_photo_url,
          summary: resume.summary || '',
          linkedin_url: resume.linkedin_url || '',
          github_url: resume.github_url || '',
          portfolio_url: resume.portfolio_url || ''
        })


        // Load sections
        await loadResumeSections(resume.id)
        setSelectedTemplate(resume.template || 'default')
      }
      setIsInitialized(true)
    } catch (err: any) {
      setError(err.message || 'Failed to load resume data')
      setIsInitialized(true)
    } finally {
      setLoading(false)
    }
  }

  const loadResumeSections = async (resumeId: string) => {
    try {
      const [educationRes, experienceRes, certificationsRes, skillsRes] = await Promise.all([
        supabase.from('resume_education').select('*').eq('resume_id', resumeId).order('start_date', { ascending: false }),
        supabase.from('resume_experience').select('*').eq('resume_id', resumeId).order('start_date', { ascending: false }),
        supabase.from('resume_certifications').select('*').eq('resume_id', resumeId).order('issue_date', { ascending: false }),
        supabase.from('resume_skills').select('*').eq('resume_id', resumeId).order('category', { ascending: true })
      ])

      setResumeSections({
        education: educationRes.data || [],
        experience: experienceRes.data || [],
        certifications: certificationsRes.data || [],
        skills: skillsRes.data || []
      })
    } catch (err: any) {
      console.error('Error loading resume sections:', err)
    }
  }

  const handleSave = async () => {
    if (!user || !resumeData.id) return

    try {
      setSaving(true)
      setError('')

      const { error: updateError } = await supabase
        .from('user_resumes')
        .update({
          full_name: resumeData.full_name,
          designation: resumeData.designation,
          email: resumeData.email,
          phone: resumeData.phone,
          location: resumeData.location,
          profile_photo_url: resumeData.profile_photo_url,
          summary: resumeData.summary,
          linkedin_url: resumeData.linkedin_url,
          github_url: resumeData.github_url,
          portfolio_url: resumeData.portfolio_url,
          template: selectedTemplate
        })
        .eq('id', resumeData.id)

      if (updateError) throw updateError

      setSuccess('Resume saved successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to save resume')
    } finally {
      setSaving(false)
    }
  }

  if (loading && !isInitialized) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-yellow-600" />
                Resume Builder
              </h1>
              <p className="text-gray-600">Create and manage your professional resume with QR code sharing.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowTemplateSelector(true)}
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                <Palette className="w-4 h-4 mr-2" />
                Select Template
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-900 font-medium rounded-lg transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Resume'}
              </button>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section - 65% */}
          <div className="lg:col-span-2">
            <ResumeForm
              resumeData={resumeData}
              setResumeData={setResumeData}
              resumeSections={resumeSections}
              setResumeSections={setResumeSections}
              onSave={handleSave}
            />
          </div>

          {/* Preview Section - 35% */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
            {/* QR Code Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
                  <QrCode className="w-5 h-5 mr-2 text-yellow-600" />
                  Resume QR Code
                </h3>
                
                {qrCodeUrl ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <img
                        src={qrCodeUrl}
                        alt="Resume QR Code"
                        className="w-32 h-32 border border-gray-200 rounded-lg"
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      Scan to view your resume online
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          const firstName = resumeData.full_name.split(' ')[0].toLowerCase()
                          const resumeUrl = `${window.location.origin}/resume/${firstName}`
                          window.open(resumeUrl, '_blank')
                        }}
                        disabled={!resumeData.full_name}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-700 text-sm font-medium rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </button>
                      <button
                        onClick={() => {
                          const link = document.createElement('a')
                          link.href = qrCodeUrl
                          link.download = 'resume-qr-code.png'
                          link.click()
                        }}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm font-medium rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Save your resume to generate QR code</p>
                  </div>
                )}
              </div>
            </div>

            <ResumeProgress
              resumeData={resumeData}
              resumeSections={resumeSections}
            />
            </div>
          </div>
        </div>

        {/* Template Selector Modal */}
        <TemplateSelector
          isOpen={showTemplateSelector}
          onClose={() => setShowTemplateSelector(false)}
          currentTemplate={selectedTemplate}
          onSelectTemplate={setSelectedTemplate}
        />
      </div>
    </DashboardLayout>
  )
}