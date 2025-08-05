import React from 'react'
import { QrCode, Download, Eye, User, Mail, Phone, MapPin, Calendar, Building, Award, Code, ExternalLink } from 'lucide-react'

interface ResumePreviewProps {
  resumeData: any
  resumeSections: any
  qrCodeUrl: string
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  resumeData,
  resumeSections,
  qrCodeUrl
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  const getResumeUrl = () => {
    if (resumeData.qr_code_id) {
      return `${window.location.origin}/resume/${resumeData.qr_code_id}`
    }
    return ''
  }

  const hasContent = () => {
    return resumeData.full_name || 
           resumeData.designation || 
           resumeSections.education.length > 0 || 
           resumeSections.experience.length > 0 || 
           resumeSections.certifications.length > 0 || 
           resumeSections.skills.length > 0
  }

  return (
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
                  onClick={() => window.open(getResumeUrl(), '_blank')}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
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

      {/* Resume Preview */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Resume Preview</h3>
        </div>
        
        <div className="p-6 max-h-96 overflow-y-auto">
          {hasContent() ? (
            <div className="space-y-6 text-sm">
              {/* Header */}
              {(resumeData.full_name || resumeData.designation) && (
                <div className="text-center border-b border-gray-200 pb-4">
                  {resumeData.full_name && (
                    <h1 className="text-xl font-bold text-gray-900 mb-1">
                      {resumeData.full_name}
                    </h1>
                  )}
                  {resumeData.designation && (
                    <p className="text-gray-600 font-medium mb-3">
                      {resumeData.designation}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
                    {resumeData.email && (
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {resumeData.email}
                      </div>
                    )}
                    {resumeData.phone && (
                      <div className="flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {resumeData.phone}
                      </div>
                    )}
                    {resumeData.location && (
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {resumeData.location}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Summary */}
              {resumeData.summary && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Professional Summary</h3>
                  <p className="text-gray-700 text-xs leading-relaxed">{resumeData.summary}</p>
                </div>
              )}

              {/* Experience */}
              {resumeSections.experience.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Building className="w-4 h-4 mr-2" />
                    Experience
                  </h3>
                  <div className="space-y-3">
                    {resumeSections.experience.map((exp: any, index: number) => (
                      <div key={index} className="border-l-2 border-yellow-400 pl-3">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h4 className="font-medium text-gray-900">{exp.position}</h4>
                            <p className="text-gray-600">{exp.company}</p>
                          </div>
                          <div className="text-xs text-gray-500 text-right">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                            </div>
                            {exp.location && <div>{exp.location}</div>}
                          </div>
                        </div>
                        {exp.description && (
                          <p className="text-xs text-gray-700 mt-1">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {resumeSections.education.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Award className="w-4 h-4 mr-2" />
                    Education
                  </h3>
                  <div className="space-y-3">
                    {resumeSections.education.map((edu: any, index: number) => (
                      <div key={index} className="border-l-2 border-blue-400 pl-3">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                            <p className="text-gray-600">{edu.institution}</p>
                            {edu.field_of_study && (
                              <p className="text-xs text-gray-500">{edu.field_of_study}</p>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 text-right">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date)}
                            </div>
                            {edu.grade_gpa && <div>GPA: {edu.grade_gpa}</div>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {resumeSections.certifications.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Award className="w-4 h-4 mr-2" />
                    Certifications
                  </h3>
                  <div className="space-y-2">
                    {resumeSections.certifications.map((cert: any, index: number) => (
                      <div key={index} className="border-l-2 border-green-400 pl-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{cert.name}</h4>
                            <p className="text-xs text-gray-600">{cert.issuing_organization}</p>
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(cert.issue_date)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {resumeSections.skills.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Code className="w-4 h-4 mr-2" />
                    Skills
                  </h3>
                  <div className="space-y-2">
                    {['technical', 'soft', 'language', 'tools', 'frameworks'].map(category => {
                      const categorySkills = resumeSections.skills.filter((skill: any) => skill.category === category)
                      if (categorySkills.length === 0) return null
                      
                      return (
                        <div key={category}>
                          <h4 className="text-xs font-medium text-gray-700 capitalize mb-1">{category}</h4>
                          <div className="flex flex-wrap gap-1">
                            {categorySkills.map((skill: any, index: number) => (
                              <span
                                key={index}
                                className="inline-block px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded"
                              >
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {(resumeData.linkedin_url || resumeData.github_url || resumeData.portfolio_url) && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Links</h3>
                  <div className="space-y-1">
                    {resumeData.linkedin_url && (
                      <div className="flex items-center text-xs text-blue-600">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        LinkedIn
                      </div>
                    )}
                    {resumeData.github_url && (
                      <div className="flex items-center text-xs text-blue-600">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        GitHub
                      </div>
                    )}
                    {resumeData.portfolio_url && (
                      <div className="flex items-center text-xs text-blue-600">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Portfolio
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Start filling out your resume information to see the preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}