import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { User, Mail, Phone, MapPin, Calendar, Building, Award, Code, ExternalLink, QrCode } from 'lucide-react'

interface ResumeData {
  id: string
  qr_code_id: string
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

export const PublicResume: React.FC = () => {
  const { firstName } = useParams<{ firstName: string }>()
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [resumeSections, setResumeSections] = useState<ResumeSection>({
    education: [],
    experience: [],
    certifications: [],
    skills: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (firstName) {
      loadResumeData()
    }
  }, [firstName])

  const loadResumeData = async () => {
    try {
      setLoading(true)
      
      // Find resume by first name (case insensitive)
      const { data: resume, error: resumeError } = await supabase
        .from('user_resumes')
        .select('*')
        .ilike('full_name', `${firstName}%`)
        .eq('is_active', true)
        .single()

      if (resumeError) {
        if (resumeError.code === 'PGRST116') {
          setError('Resume not found')
        } else {
          throw resumeError
        }
        return
      }

      setResumeData(resume)

      // Load all resume sections
      const [educationRes, experienceRes, certificationsRes, skillsRes] = await Promise.all([
        supabase.from('resume_education').select('*').eq('resume_id', resume.id).order('start_date', { ascending: false }),
        supabase.from('resume_experience').select('*').eq('resume_id', resume.id).order('start_date', { ascending: false }),
        supabase.from('resume_certifications').select('*').eq('resume_id', resume.id).order('issue_date', { ascending: false }),
        supabase.from('resume_skills').select('*').eq('resume_id', resume.id).order('category', { ascending: true })
      ])

      setResumeSections({
        education: educationRes.data || [],
        experience: experienceRes.data || [],
        certifications: certificationsRes.data || [],
        skills: skillsRes.data || []
      })

    } catch (err: any) {
      setError(err.message || 'Failed to load resume')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  const groupSkillsByCategory = (skills: any[]) => {
    return skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    }, {})
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
      </div>
    )
  }

  if (error || !resumeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Resume Not Found</h1>
          <p className="text-gray-600 mb-6">
            The resume you're looking for doesn't exist or has been made private.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition-colors"
          >
            Create Your Own Resume
          </Link>
        </div>
      </div>
    )
  }

  const skillsByCategory = groupSkillsByCategory(resumeSections.skills)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {resumeData.profile_photo_url ? (
                  <img 
                    src={resumeData.profile_photo_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {resumeData.full_name}
              </h1>
              {resumeData.designation && (
                <p className="text-xl text-gray-600 font-medium mb-4">
                  {resumeData.designation}
                </p>
              )}
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {resumeData.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    <a href={`mailto:${resumeData.email}`} className="hover:text-yellow-600">
                      {resumeData.email}
                    </a>
                  </div>
                )}
                {resumeData.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    <a href={`tel:${resumeData.phone}`} className="hover:text-yellow-600">
                      {resumeData.phone}
                    </a>
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
                <div className="flex flex-wrap gap-4 mt-4">
                  {resumeData.linkedin_url && (
                    <a
                      href={resumeData.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      LinkedIn
                    </a>
                  )}
                  {resumeData.github_url && (
                    <a
                      href={resumeData.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      GitHub
                    </a>
                  )}
                  {resumeData.portfolio_url && (
                    <a
                      href={resumeData.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm hover:bg-yellow-200 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Portfolio
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        {resumeData.summary && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Professional Summary</h2>
            <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
          </div>
        )}

        {/* Experience */}
        {resumeSections.experience.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Code className="w-5 h-5 mr-2 text-purple-600" />
              Skills
            </h2>
            <div className="space-y-4">
              {Object.entries(skillsByCategory).map(([category, skills]: [string, any]) => (
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

        {/* Footer */}
        <div className="text-center py-8">
          <div className="inline-flex items-center px-4 py-2 bg-yellow-100 rounded-lg">
            <QrCode className="w-4 h-4 mr-2 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Powered by <strong>Dr. QR Code</strong> - Create your own resume
            </span>
          </div>
          <div className="mt-4">
            <Link
              to="/signup"
              className="inline-flex items-center px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition-colors"
            >
              Create Your Resume
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}