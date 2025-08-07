import React from 'react'
import { QrCode, Download, Eye, User, Mail, Phone, MapPin, Calendar, Building, Award, Code, ExternalLink } from 'lucide-react'

interface ResumePreviewProps {
  resumeData: any
  resumeSections: any
  qrCodeUrl: string
  template?: string
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  resumeData,
  resumeSections,
  qrCodeUrl,
  template = 'default'
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  const getResumeUrl = () => {
    if (resumeData.qr_code_id && resumeData.full_name) {
      const firstName = resumeData.full_name.split(' ')[0].toLowerCase()
      return `${window.location.origin}/resume/${firstName}`
    }
    return ''
  }

  const groupSkillsByCategory = (skills: any[]) => {
    return skills.reduce((acc: any, skill: any) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    }, {})
  }

  const hasContent = () => {
    return resumeData.full_name || 
           resumeData.designation || 
           resumeSections.education.length > 0 || 
           resumeSections.experience.length > 0 || 
           resumeSections.certifications.length > 0 || 
           resumeSections.skills.length > 0
  }

  const renderResumeContent = () => {
    if (!hasContent()) {
      return (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Start filling out your resume information to see the preview</p>
        </div>
      )
    }

    switch (template) {
      case 'modern':
        return (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 min-h-full">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              {/* Header */}
              {(resumeData.full_name || resumeData.designation) && (
                <div className="border-b-2 border-blue-500 pb-4 mb-6">
                  {resumeData.full_name && (
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{resumeData.full_name}</h1>
                  )}
                  {resumeData.designation && (
                    <p className="text-blue-600 font-semibold text-lg mb-3">{resumeData.designation}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {resumeData.email && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        {resumeData.email}
                      </div>
                    )}
                    {resumeData.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        {resumeData.phone}
                      </div>
                    )}
                    {resumeData.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {resumeData.location}
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  {(resumeData.linkedin_url || resumeData.github_url || resumeData.portfolio_url) && (
                    <div className="flex flex-wrap gap-3 mt-4">
                      {resumeData.linkedin_url && (
                        <a
                          href={resumeData.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          LinkedIn
                        </a>
                      )}
                      {resumeData.github_url && (
                        <a
                          href={resumeData.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          GitHub
                        </a>
                      )}
                      {resumeData.portfolio_url && (
                        <a
                          href={resumeData.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                          Portfolio
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Summary */}
              {resumeData.summary && (
                <div className="mb-6">
                  <h3 className="font-semibold text-blue-700 mb-3 uppercase tracking-wide">Summary</h3>
                  <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
                </div>
              )}

              {/* Experience */}
              {resumeSections.experience.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-blue-700 mb-4 uppercase tracking-wide flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Experience
                  </h3>
                  <div className="space-y-4">
                    {resumeSections.experience.map((exp: any, index: number) => (
                      <div key={index} className="border-l-3 border-blue-400 pl-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                            <p className="text-blue-600 font-medium">{exp.company}</p>
                            {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                          </div>
                          <div className="text-sm text-gray-500 text-right">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                            </div>
                          </div>
                        </div>
                        {exp.description && (
                          <p className="text-gray-700 mt-2">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {resumeSections.education.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-blue-700 mb-4 uppercase tracking-wide flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Education
                  </h3>
                  <div className="space-y-4">
                    {resumeSections.education.map((edu: any, index: number) => (
                      <div key={index} className="border-l-3 border-blue-400 pl-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                            <p className="text-blue-600 font-medium">{edu.institution}</p>
                            {edu.field_of_study && <p className="text-sm text-gray-500">{edu.field_of_study}</p>}
                          </div>
                          <div className="text-sm text-gray-500 text-right">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
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

              {/* Skills */}
              {resumeSections.skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-blue-700 mb-4 uppercase tracking-wide flex items-center">
                    <Code className="w-5 h-5 mr-2" />
                    Skills
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(groupSkillsByCategory(resumeSections.skills)).map(([category, skills]: [string, any]) => (
                      <div key={category}>
                        <h4 className="text-sm font-medium text-gray-700 capitalize mb-2">{category} Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill: any, index: number) => (
                            <span
                              key={index}
                              className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {resumeSections.certifications.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-blue-700 mb-4 uppercase tracking-wide flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Certifications
                  </h3>
                  <div className="space-y-3">
                    {resumeSections.certifications.map((cert: any, index: number) => (
                      <div key={index} className="border-l-3 border-blue-400 pl-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                            <p className="text-blue-600">{cert.issuing_organization}</p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(cert.issue_date)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 'minimal':
        return (
          <div className="min-h-screen bg-white py-12">
            <div className="max-w-3xl mx-auto px-4">
              {/* Header */}
              <div className="text-center border-b border-gray-300 pb-8 mb-12">
                <div className="mb-6">
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mx-auto">
                    {resumeData.profile_photo_url ? (
                      <img 
                        src={resumeData.profile_photo_url} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                </div>
                
                <h1 className="text-4xl font-light text-gray-900 mb-3">{resumeData.full_name}</h1>
                {resumeData.designation && (
                  <p className="text-gray-600 uppercase tracking-widest text-lg font-medium">{resumeData.designation}</p>
                )}
                
                <div className="flex justify-center gap-8 text-gray-500 mt-6">
                  {resumeData.email && <span>{resumeData.email}</span>}
                  {resumeData.phone && <span>{resumeData.phone}</span>}
                  {resumeData.location && <span>{resumeData.location}</span>}
                </div>

                {/* Social Links */}
                {(resumeData.linkedin_url || resumeData.github_url || resumeData.portfolio_url) && (
                  <div className="text-center mt-6">
                    <h3 className="font-light text-gray-900 mb-4 uppercase tracking-wider">Links</h3>
                    <div className="flex justify-center gap-6">
                      {resumeData.linkedin_url && (
                        <a
                          href={resumeData.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          LinkedIn
                        </a>
                      )}
                      {resumeData.github_url && (
                        <a
                          href={resumeData.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          GitHub
                        </a>
                      )}
                      {resumeData.portfolio_url && (
                        <a
                          href={resumeData.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                          Portfolio
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Summary */}
              {resumeData.summary && (
                <div className="mb-12">
                  <p className="text-gray-700 leading-relaxed italic text-center text-xl">
                    "{resumeData.summary}"
                  </p>
                </div>
              )}

              {/* Experience */}
              {resumeSections.experience.length > 0 && (
                <div className="mb-12">
                  <h2 className="font-light text-gray-900 mb-8 text-center uppercase tracking-widest text-2xl">Experience</h2>
                  <div className="space-y-8">
                    {resumeSections.experience.map((exp: any, index: number) => (
                      <div key={index} className="text-center">
                        <h3 className="text-xl font-medium text-gray-900">{exp.position}</h3>
                        <p className="text-gray-600">{exp.company} • {exp.location}</p>
                        <p className="text-gray-500 mb-4">
                          {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                        </p>
                        {exp.description && (
                          <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {resumeSections.education.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-light text-gray-900 mb-6 text-center uppercase tracking-wider text-lg">Education</h3>
                  <div className="space-y-4">
                    {resumeSections.education.map((edu: any, index: number) => (
                      <div key={index} className="text-center">
                        <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                        <p className="text-gray-600">{edu.institution}</p>
                        {edu.field_of_study && <p className="text-sm text-gray-500">{edu.field_of_study}</p>}
                        <p className="text-sm text-gray-500">
                          {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date)}
                        </p>
                        {edu.grade_gpa && <p className="text-sm text-gray-500">GPA: {edu.grade_gpa}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {resumeSections.skills.length > 0 && (
                <div className="mb-8 text-center">
                  <h3 className="font-light text-gray-900 mb-4 uppercase tracking-wider text-lg">Skills</h3>
                  <div className="flex justify-center flex-wrap gap-4">
                    {resumeSections.skills.map((skill: any, index: number) => (
                      <span key={index} className="text-gray-600 border-b border-gray-300 pb-1">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {resumeSections.certifications.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-light text-gray-900 mb-6 text-center uppercase tracking-wider text-lg">Certifications</h3>
                  <div className="space-y-3">
                    {resumeSections.certifications.map((cert: any, index: number) => (
                      <div key={index} className="text-center">
                        <h4 className="font-medium text-gray-900">{cert.name}</h4>
                        <p className="text-gray-600 text-sm">{cert.issuing_organization}</p>
                        <p className="text-sm text-gray-500">{formatDate(cert.issue_date)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 'creative':
        return (
          <div className="min-h-screen bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4">
              {/* Header */}
              <div className="bg-yellow-400 text-gray-900 p-8 rounded-t-lg">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center overflow-hidden">
                      {resumeData.profile_photo_url ? (
                        <img 
                          src={resumeData.profile_photo_url} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-yellow-400" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold mb-2">{resumeData.full_name}</h1>
                    {resumeData.designation && (
                      <p className="text-2xl font-semibold">{resumeData.designation}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-white text-gray-900 p-8 rounded-b-lg">
                <div className="flex flex-wrap gap-4 mb-8">
                  {resumeData.email && (
                    <span className="bg-gray-100 px-4 py-2 rounded-full">{resumeData.email}</span>
                  )}
                  {resumeData.phone && (
                    <span className="bg-gray-100 px-4 py-2 rounded-full">{resumeData.phone}</span>
                  )}
                  {resumeData.location && (
                    <span className="bg-gray-100 px-4 py-2 rounded-full">{resumeData.location}</span>
                  )}
                </div>

                {/* Social Links */}
                {(resumeData.linkedin_url || resumeData.github_url || resumeData.portfolio_url) && (
                  <div className="mb-8">
                    <div className="flex items-center mb-3">
                      <div className="w-6 h-6 bg-yellow-400 rounded-full mr-3"></div>
                      <h3 className="font-bold text-gray-900 uppercase tracking-wide">Links</h3>
                    </div>
                    <div className="flex flex-wrap gap-3 pl-9">
                      {resumeData.linkedin_url && (
                        <a
                          href={resumeData.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-yellow-600 hover:text-yellow-700 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          LinkedIn
                        </a>
                      )}
                      {resumeData.github_url && (
                        <a
                          href={resumeData.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-yellow-600 hover:text-yellow-700 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          GitHub
                        </a>
                      )}
                      {resumeData.portfolio_url && (
                        <a
                          href={resumeData.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-yellow-600 hover:text-yellow-700 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                          Portfolio
                        </a>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Summary */}
                {resumeData.summary && (
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-yellow-400 rounded-full mr-4"></div>
                      <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">About</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg pl-12">{resumeData.summary}</p>
                  </div>
                )}
                
                {/* Experience */}
                {resumeSections.experience.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-yellow-400 rounded-full mr-4"></div>
                      <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">Experience</h2>
                    </div>
                    <div className="space-y-6">
                      {resumeSections.experience.map((exp: any, index: number) => (
                        <div key={index} className="pl-12">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                              <p className="text-yellow-600 font-medium text-lg">{exp.company}</p>
                              {exp.location && <p className="text-gray-500">{exp.location}</p>}
                            </div>
                            <span className="text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                              {formatDate(exp.start_date)} - {exp.is_current ? 'Now' : formatDate(exp.end_date)}
                            </span>
                          </div>
                          {exp.description && (
                            <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Education */}
                {resumeSections.education.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <div className="w-6 h-6 bg-yellow-400 rounded-full mr-3"></div>
                      <h3 className="font-bold text-gray-900 uppercase tracking-wide">Education</h3>
                    </div>
                    <div className="space-y-4">
                      {resumeSections.education.map((edu: any, index: number) => (
                        <div key={index} className="pl-9">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                              <p className="text-yellow-600 font-medium">{edu.institution}</p>
                              {edu.field_of_study && <p className="text-sm text-gray-500">{edu.field_of_study}</p>}
                            </div>
                            <div className="text-sm text-gray-500 text-right">
                              <div>{formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date)}</div>
                              {edu.grade_gpa && <div>GPA: {edu.grade_gpa}</div>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Skills */}
                {resumeSections.skills.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <div className="w-6 h-6 bg-yellow-400 rounded-full mr-3"></div>
                      <h3 className="font-bold text-gray-900 uppercase tracking-wide">Skills</h3>
                    </div>
                    <div className="space-y-3">
                      {Object.entries(groupSkillsByCategory(resumeSections.skills)).map(([category, skills]: [string, any]) => (
                        <div key={category} className="pl-9">
                          <h4 className="text-sm font-semibold text-gray-700 capitalize mb-2">{category} Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {skills.map((skill: any, index: number) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium"
                              >
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Certifications */}
                {resumeSections.certifications.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <div className="w-6 h-6 bg-yellow-400 rounded-full mr-3"></div>
                      <h3 className="font-bold text-gray-900 uppercase tracking-wide">Certifications</h3>
                    </div>
                    <div className="space-y-3">
                      {resumeSections.certifications.map((cert: any, index: number) => (
                        <div key={index} className="pl-9">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                              <p className="text-yellow-600">{cert.issuing_organization}</p>
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDate(cert.issue_date)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      default: // Classic template
        return (
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

                {/* Social Links */}
                {(resumeData.linkedin_url || resumeData.github_url || resumeData.portfolio_url) && (
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {resumeData.linkedin_url && (
                      <a
                        href={resumeData.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        LinkedIn
                      </a>
                    )}
                    {resumeData.github_url && (
                      <a
                        href={resumeData.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                      </a>
                    )}
                    {resumeData.portfolio_url && (
                      <a
                        href={resumeData.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm hover:bg-yellow-200 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        Portfolio
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Professional Summary */}
            {resumeData.summary && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Professional Summary</h2>
                <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
              </div>
            )}

            {/* Experience */}
            {resumeSections.experience.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Building className="w-5 h-5 mr-2 text-yellow-600" />
                  Work Experience
                </h2>
                <div className="space-y-6">
                  {resumeSections.experience.map((exp: any, index: number) => (
                    <div key={index} className="border-l-4 border-yellow-400 pl-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                          <p className="text-gray-600 font-medium">{exp.company}</p>
                          {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                        </div>
                        <div className="text-sm text-gray-500 text-right">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                          </div>
                        </div>
                      </div>
                      {exp.description && (
                        <p className="text-gray-700 mt-2 leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resumeSections.education.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-blue-600" />
                  Education
                </h2>
                <div className="space-y-6">
                  {resumeSections.education.map((edu: any, index: number) => (
                    <div key={index} className="border-l-4 border-blue-400 pl-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                          <p className="text-gray-600 font-medium">{edu.institution}</p>
                          {edu.field_of_study && <p className="text-sm text-gray-500">{edu.field_of_study}</p>}
                          {edu.grade_gpa && <p className="text-sm text-gray-500">GPA: {edu.grade_gpa}</p>}
                        </div>
                        <div className="text-sm text-gray-500 text-right">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date)}
                          </div>
                        </div>
                      </div>
                      {edu.description && (
                        <p className="text-gray-700 mt-2 leading-relaxed">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {resumeSections.certifications.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-green-600" />
                  Certifications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resumeSections.certifications.map((cert: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{cert.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{cert.issuing_organization}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Issued: {formatDate(cert.issue_date)}</span>
                        {cert.expiry_date && <span>Expires: {formatDate(cert.expiry_date)}</span>}
                      </div>
                      {cert.credential_url && (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center mt-2 text-xs text-blue-600 hover:text-blue-700"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View Credential
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {resumeSections.skills.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Code className="w-5 h-5 mr-2 text-purple-600" />
                  Skills
                </h2>
                <div className="space-y-4">
                  {Object.entries(groupSkillsByCategory(resumeSections.skills)).map(([category, skills]: [string, any]) => (
                    <div key={category}>
                      <h3 className="text-sm font-semibold text-gray-700 capitalize mb-2">{category} Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill: any, index: number) => (
                          <span
                            key={index}
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                              skill.proficiency_level === 'expert' ? 'bg-green-100 text-green-800' :
                              skill.proficiency_level === 'advanced' ? 'bg-blue-100 text-blue-800' :
                              skill.proficiency_level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
    }
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
          {renderResumeContent()}
        </div>
      </div>
    </div>
  )
}