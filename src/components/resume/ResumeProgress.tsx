import React from 'react'
import { CheckCircle, Circle, User, Briefcase, GraduationCap, Award, Code, Link as LinkIcon, AlertCircle } from 'lucide-react'

interface ResumeProgressProps {
  resumeData: any
  resumeSections: any
}

export const ResumeProgress: React.FC<ResumeProgressProps> = ({
  resumeData,
  resumeSections
}) => {
  const calculateProgress = () => {
    let completed = 0
    let total = 6
    const suggestions = []

    // Basic Info (required fields)
    const basicInfoComplete = resumeData.full_name && resumeData.designation && resumeData.email
    if (basicInfoComplete) {
      completed++
    } else {
      suggestions.push("Add your full name, job title, and email address")
    }

    // Summary
    const summaryComplete = resumeData.summary && resumeData.summary.length >= 60
    if (summaryComplete) {
      completed++
    } else if (resumeData.summary && resumeData.summary.length < 60) {
      suggestions.push(`Write a longer summary (${resumeData.summary.length}/60 words minimum)`)
    } else {
      suggestions.push("Add a professional summary (60+ words)")
    }

    // Experience
    if (resumeSections.experience && resumeSections.experience.length > 0) {
      completed++
    } else {
      suggestions.push("Add at least one work experience")
    }

    // Education
    if (resumeSections.education && resumeSections.education.length > 0) {
      completed++
    } else {
      suggestions.push("Add your educational background")
    }

    // Skills
    if (resumeSections.skills && resumeSections.skills.length > 0) {
      completed++
    } else {
      suggestions.push("Add your professional skills")
    }

    // Social Links (at least one)
    const socialLinks = [
      { name: 'LinkedIn', url: resumeData.linkedin_url },
      { name: 'GitHub', url: resumeData.github_url },
      { name: 'Portfolio', url: resumeData.portfolio_url }
    ].filter(link => link.url)
    
    if (socialLinks.length >= 2) {
      completed++
    } else if (socialLinks.length === 1) {
      const missing = ['LinkedIn', 'GitHub', 'Portfolio'].filter(name => 
        !socialLinks.find(link => link.name === name)
      )
      suggestions.push(`Add more social links (${missing.slice(0, 2).join(' or ')}) to improve your profile`)
    } else {
      suggestions.push("Add social links (LinkedIn, GitHub, or Portfolio)")
    }

    return { completed, total, percentage: Math.round((completed / total) * 100), suggestions }
  }

  const progress = calculateProgress()

  const sections = [
    {
      id: 'basic',
      title: 'Basic Information',
      icon: User,
      completed: !!(resumeData.full_name && resumeData.designation && resumeData.email),
      description: 'Name, title, contact info'
    },
    {
      id: 'summary',
      title: 'Professional Summary',
      icon: User,
      completed: !!(resumeData.summary && resumeData.summary.length >= 60),
      description: 'Brief overview of your experience (60+ words)',
      current: resumeData.summary ? resumeData.summary.length : 0,
      target: 60
    },
    {
      id: 'experience',
      title: 'Work Experience',
      icon: Briefcase,
      completed: !!(resumeSections.experience && resumeSections.experience.length > 0),
      description: 'Your professional background'
    },
    {
      id: 'education',
      title: 'Education',
      icon: GraduationCap,
      completed: !!(resumeSections.education && resumeSections.education.length > 0),
      description: 'Academic qualifications'
    },
    {
      id: 'skills',
      title: 'Skills',
      icon: Code,
      completed: !!(resumeSections.skills && resumeSections.skills.length > 0),
      description: 'Technical and soft skills'
    },
    {
      id: 'links',
      title: 'Social Links',
      icon: LinkIcon,
      completed: !![resumeData.linkedin_url, resumeData.github_url, resumeData.portfolio_url].filter(Boolean).length >= 2,
      description: 'LinkedIn, GitHub, Portfolio (2+ recommended)',
      current: [resumeData.linkedin_url, resumeData.github_url, resumeData.portfolio_url].filter(Boolean).length,
      target: 2
    }
  ]

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center mb-6">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#facc15"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${progress.percentage * 2.51} 251`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{progress.percentage}%</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Resume Completion</h3>
          <p className="text-gray-600">
            {progress.completed} of {progress.total} sections completed
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>

        {progress.percentage === 100 ? (
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-green-800 font-medium">Resume Complete!</p>
            <p className="text-green-600 text-sm">Your resume is ready to share</p>
          </div>
        ) : (
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-yellow-800 font-medium">Almost there!</p>
            <p className="text-yellow-600 text-sm">
              Complete {progress.total - progress.completed} more section{progress.total - progress.completed !== 1 ? 's' : ''} to finish
            </p>
          </div>
        )}
      </div>

      {/* Section Checklist */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Section Checklist</h4>
        <div className="space-y-3">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <div
                key={section.id}
                className={`flex items-center p-3 rounded-lg border transition-colors ${
                  section.completed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex-shrink-0 mr-3">
                  {section.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-shrink-0 mr-3">
                  <Icon className={`w-5 h-5 ${section.completed ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1">
                  <h5 className={`font-medium ${section.completed ? 'text-green-900' : 'text-gray-900'}`}>
                    {section.title}
                  </h5>
                  <p className={`text-sm ${section.completed ? 'text-green-600' : 'text-gray-500'}`}>
                    {section.description}
                  </p>
                  {section.current !== undefined && section.target && !section.completed && (
                    <p className="text-xs text-yellow-600 mt-1">
                      Current: {section.current}/{section.target}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Improvement Suggestions */}
      {progress.suggestions.length > 0 && (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Suggestions to Improve Your Resume</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                {progress.suggestions.map((suggestion, index) => (
                  <li key={index}>• {suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      {/* Tips */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Tips for a Great Resume</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Write a compelling summary with 60+ words</li>
          <li>• Use action verbs in your experience descriptions</li>
          <li>• Include relevant skills for your target role</li>
          <li>• Add multiple social links to showcase your professional presence</li>
        </ul>
      </div>
    </div>
  )
}