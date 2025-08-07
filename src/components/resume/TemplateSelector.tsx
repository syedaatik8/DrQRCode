import React, { useState } from 'react'
import { X, Check } from 'lucide-react'

interface TemplateSelectorProps {
  isOpen: boolean
  onClose: () => void
  currentTemplate: string
  onSelectTemplate: (templateId: string) => void
}

const dummyData = {
  full_name: "John Doe",
  designation: "Senior Software Engineer",
  email: "john.doe@email.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  summary: "Experienced software engineer with 5+ years in full-stack development, specializing in React, Node.js, and cloud technologies.",
  linkedin_url: "https://linkedin.com/in/johndoe",
  github_url: "https://github.com/johndoe",
  portfolio_url: "https://johndoe.dev"
}

const dummySections = {
  experience: [
    {
      company: "Tech Corp",
      position: "Senior Software Engineer",
      location: "San Francisco, CA",
      start_date: "2022-01-01",
      end_date: "",
      is_current: true,
      description: "Led development of microservices architecture serving 1M+ users daily."
    },
    {
      company: "StartupXYZ",
      position: "Full Stack Developer",
      location: "Remote",
      start_date: "2020-06-01",
      end_date: "2021-12-31",
      is_current: false,
      description: "Built responsive web applications using React and Node.js."
    }
  ],
  education: [
    {
      institution: "University of California",
      degree: "Bachelor of Science",
      field_of_study: "Computer Science",
      start_date: "2016-09-01",
      end_date: "2020-05-31",
      is_current: false,
      grade_gpa: "3.8/4.0"
    }
  ],
  skills: [
    { name: "JavaScript", category: "technical", proficiency_level: "expert" },
    { name: "React", category: "frameworks", proficiency_level: "advanced" },
    { name: "Node.js", category: "technical", proficiency_level: "advanced" },
    { name: "Python", category: "technical", proficiency_level: "intermediate" },
    { name: "Leadership", category: "soft", proficiency_level: "advanced" }
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      issuing_organization: "Amazon Web Services",
      issue_date: "2023-03-15",
      expiry_date: "2026-03-15"
    }
  ]
}

const templates = [
  {
    id: 'default',
    name: 'Classic',
    description: 'Clean and professional layout'
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with accent colors'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant typography focus'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold design with visual elements'
  }
]

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  isOpen,
  onClose,
  currentTemplate,
  onSelectTemplate
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState(currentTemplate)

  if (!isOpen) return null

  const handleSelect = () => {
    onSelectTemplate(selectedTemplate)
    onClose()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  const renderTemplate = (templateId: string) => {
    switch (templateId) {
      case 'modern':
        return (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 text-xs">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              {/* Header */}
              <div className="border-b-2 border-blue-500 pb-3 mb-3">
                <h1 className="text-lg font-bold text-gray-900">{dummyData.full_name}</h1>
                <p className="text-blue-600 font-semibold">{dummyData.designation}</p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-600 mt-2">
                  <span>{dummyData.email}</span>
                  <span>•</span>
                  <span>{dummyData.phone}</span>
                  <span>•</span>
                  <span>{dummyData.location}</span>
                </div>
              </div>
              
              {/* Summary */}
              <div className="mb-3">
                <h3 className="font-semibold text-blue-700 mb-1">SUMMARY</h3>
                <p className="text-gray-700 text-xs leading-relaxed">{dummyData.summary}</p>
              </div>
              
              {/* Experience */}
              <div className="mb-3">
                <h3 className="font-semibold text-blue-700 mb-2">EXPERIENCE</h3>
                {dummySections.experience.slice(0, 2).map((exp, index) => (
                  <div key={index} className="mb-2 pl-3 border-l-2 border-blue-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{exp.position}</h4>
                        <p className="text-blue-600 text-xs">{exp.company}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 mt-1">{exp.description}</p>
                  </div>
                ))}
              </div>
              
              {/* Skills */}
              <div>
                <h3 className="font-semibold text-blue-700 mb-1">SKILLS</h3>
                <div className="flex flex-wrap gap-1">
                  {dummySections.skills.slice(0, 5).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'minimal':
        return (
          <div className="bg-white p-4 text-xs">
            {/* Header */}
            <div className="text-center border-b border-gray-300 pb-3 mb-4">
              <h1 className="text-xl font-light text-gray-900 mb-1">{dummyData.full_name}</h1>
              <p className="text-gray-600 uppercase tracking-wide text-xs">{dummyData.designation}</p>
              <div className="flex justify-center gap-3 text-xs text-gray-500 mt-2">
                <span>{dummyData.email}</span>
                <span>{dummyData.phone}</span>
                <span>{dummyData.location}</span>
              </div>
            </div>
            
            {/* Summary */}
            <div className="mb-4">
              <p className="text-gray-700 text-xs leading-relaxed italic text-center">
                "{dummyData.summary}"
              </p>
            </div>
            
            {/* Experience */}
            <div className="mb-4">
              <h3 className="font-light text-gray-900 mb-3 text-center uppercase tracking-wider">Experience</h3>
              {dummySections.experience.slice(0, 2).map((exp, index) => (
                <div key={index} className="mb-3 text-center">
                  <h4 className="font-medium text-gray-900">{exp.position}</h4>
                  <p className="text-gray-600 text-xs">{exp.company} • {exp.location}</p>
                  <p className="text-xs text-gray-500 mb-1">
                    {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                  </p>
                  <p className="text-xs text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>
            
            {/* Skills */}
            <div className="text-center">
              <h3 className="font-light text-gray-900 mb-2 uppercase tracking-wider">Skills</h3>
              <div className="flex justify-center flex-wrap gap-2">
                {dummySections.skills.slice(0, 5).map((skill, index) => (
                  <span key={index} className="text-xs text-gray-600 border-b border-gray-300 pb-1">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )
      
      case 'creative':
        return (
          <div className="bg-gray-900 text-white p-4 text-xs">
            {/* Header */}
            <div className="bg-yellow-400 text-gray-900 p-3 rounded-t-lg">
              <h1 className="text-lg font-bold">{dummyData.full_name}</h1>
              <p className="font-semibold">{dummyData.designation}</p>
            </div>
            
            <div className="bg-white text-gray-900 p-3 rounded-b-lg">
              <div className="flex flex-wrap gap-2 text-xs mb-3">
                <span className="bg-gray-100 px-2 py-1 rounded">{dummyData.email}</span>
                <span className="bg-gray-100 px-2 py-1 rounded">{dummyData.phone}</span>
                <span className="bg-gray-100 px-2 py-1 rounded">{dummyData.location}</span>
              </div>
              
              {/* Summary */}
              <div className="mb-3">
                <div className="flex items-center mb-1">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full mr-2"></div>
                  <h3 className="font-bold text-gray-900">ABOUT</h3>
                </div>
                <p className="text-gray-700 text-xs leading-relaxed pl-6">{dummyData.summary}</p>
              </div>
              
              {/* Experience */}
              <div className="mb-3">
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full mr-2"></div>
                  <h3 className="font-bold text-gray-900">EXPERIENCE</h3>
                </div>
                {dummySections.experience.slice(0, 2).map((exp, index) => (
                  <div key={index} className="mb-2 pl-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                        <p className="text-yellow-600 font-medium text-xs">{exp.company}</p>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {formatDate(exp.start_date)} - {exp.is_current ? 'Now' : formatDate(exp.end_date)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 mt-1">{exp.description}</p>
                  </div>
                ))}
              </div>
              
              {/* Skills */}
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full mr-2"></div>
                  <h3 className="font-bold text-gray-900">SKILLS</h3>
                </div>
                <div className="flex flex-wrap gap-1 pl-6">
                  {dummySections.skills.slice(0, 5).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      
      default: // Classic template
        return (
          <div className="bg-white p-4 text-xs">
            {/* Header */}
            <div className="text-center border-b border-gray-200 pb-3 mb-3">
              <h1 className="text-lg font-bold text-gray-900 mb-1">{dummyData.full_name}</h1>
              <p className="text-gray-600 font-medium">{dummyData.designation}</p>
              <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-500 mt-2">
                <span>{dummyData.email}</span>
                <span>{dummyData.phone}</span>
                <span>{dummyData.location}</span>
              </div>
            </div>
            
            {/* Summary */}
            <div className="mb-3">
              <h3 className="font-semibold text-gray-900 mb-1">Professional Summary</h3>
              <p className="text-gray-700 text-xs leading-relaxed">{dummyData.summary}</p>
            </div>
            
            {/* Experience */}
            <div className="mb-3">
              <h3 className="font-semibold text-gray-900 mb-2">Experience</h3>
              {dummySections.experience.slice(0, 2).map((exp, index) => (
                <div key={index} className="mb-2 border-l-2 border-yellow-400 pl-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{exp.position}</h4>
                      <p className="text-gray-600">{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
            
            {/* Skills */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Skills</h3>
              <div className="flex flex-wrap gap-1">
                {dummySections.skills.slice(0, 5).map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Choose Your Template</h2>
            <p className="text-sm text-gray-600 mt-1">Select a design that best represents your style</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-180px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? 'border-yellow-400 ring-2 ring-yellow-400 ring-opacity-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                    {selectedTemplate === template.id && (
                      <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="h-64 overflow-hidden">
                  {renderTemplate(template.id)}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSelect}
            className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition-colors"
          >
            Apply Template
          </button>
        </div>
      </div>
    </div>
  )
}