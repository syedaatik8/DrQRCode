import React, { useState } from 'react'
import { User, Mail, Phone, MapPin, FileText, Link as LinkIcon, Plus, Trash2, Calendar, Building, Award, Code } from 'lucide-react'

interface ResumeFormProps {
  resumeData: any
  setResumeData: (data: any) => void
  resumeSections: any
  setResumeSections: (sections: any) => void
  onSave: () => void
}

export const ResumeForm: React.FC<ResumeFormProps> = ({
  resumeData,
  setResumeData,
  resumeSections,
  setResumeSections,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState('basic')

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'education', label: 'Education', icon: FileText },
    { id: 'experience', label: 'Experience', icon: Building },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'skills', label: 'Skills', icon: Code }
  ]

  const handleInputChange = (field: string, value: string) => {
    setResumeData({ ...resumeData, [field]: value })
  }

  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field_of_study: '',
      start_date: '',
      end_date: '',
      is_current: false,
      grade_gpa: '',
      description: ''
    }
    setResumeSections({
      ...resumeSections,
      education: [...resumeSections.education, newEducation]
    })
  }

  const updateEducation = (index: number, field: string, value: any) => {
    const updated = [...resumeSections.education]
    updated[index] = { ...updated[index], [field]: value }
    setResumeSections({ ...resumeSections, education: updated })
  }

  const removeEducation = (index: number) => {
    const updated = resumeSections.education.filter((_: any, i: number) => i !== index)
    setResumeSections({ ...resumeSections, education: updated })
  }

  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: ''
    }
    setResumeSections({
      ...resumeSections,
      experience: [...resumeSections.experience, newExperience]
    })
  }

  const updateExperience = (index: number, field: string, value: any) => {
    const updated = [...resumeSections.experience]
    updated[index] = { ...updated[index], [field]: value }
    setResumeSections({ ...resumeSections, experience: updated })
  }

  const removeExperience = (index: number) => {
    const updated = resumeSections.experience.filter((_: any, i: number) => i !== index)
    setResumeSections({ ...resumeSections, experience: updated })
  }

  const addCertification = () => {
    const newCertification = {
      id: Date.now().toString(),
      name: '',
      issuing_organization: '',
      issue_date: '',
      expiry_date: '',
      credential_id: '',
      credential_url: ''
    }
    setResumeSections({
      ...resumeSections,
      certifications: [...resumeSections.certifications, newCertification]
    })
  }

  const updateCertification = (index: number, field: string, value: any) => {
    const updated = [...resumeSections.certifications]
    updated[index] = { ...updated[index], [field]: value }
    setResumeSections({ ...resumeSections, certifications: updated })
  }

  const removeCertification = (index: number) => {
    const updated = resumeSections.certifications.filter((_: any, i: number) => i !== index)
    setResumeSections({ ...resumeSections, certifications: updated })
  }

  const addSkill = () => {
    const newSkill = {
      id: Date.now().toString(),
      name: '',
      category: 'technical',
      proficiency_level: 'intermediate'
    }
    setResumeSections({
      ...resumeSections,
      skills: [...resumeSections.skills, newSkill]
    })
  }

  const updateSkill = (index: number, field: string, value: any) => {
    const updated = [...resumeSections.skills]
    updated[index] = { ...updated[index], [field]: value }
    setResumeSections({ ...resumeSections, skills: updated })
  }

  const removeSkill = (index: number) => {
    const updated = resumeSections.skills.filter((_: any, i: number) => i !== index)
    setResumeSections({ ...resumeSections, skills: updated })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-yellow-400 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={resumeData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Designation
                </label>
                <input
                  type="text"
                  value={resumeData.designation}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={resumeData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone
                </label>
                <input
                  type="tel"
                  value={resumeData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location
                </label>
                <input
                  type="text"
                  value={resumeData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="New York, NY"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Summary
              </label>
              <textarea
                value={resumeData.summary}
                onChange={(e) => handleInputChange('summary', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Brief professional summary..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <LinkIcon className="w-4 h-4 inline mr-2" />
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={resumeData.linkedin_url}
                  onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <LinkIcon className="w-4 h-4 inline mr-2" />
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={resumeData.github_url}
                  onChange={(e) => handleInputChange('github_url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="https://github.com/johndoe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <LinkIcon className="w-4 h-4 inline mr-2" />
                  Portfolio URL
                </label>
                <input
                  type="url"
                  value={resumeData.portfolio_url}
                  onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="https://johndoe.com"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'education' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Education</h3>
              <button
                onClick={addEducation}
                className="inline-flex items-center px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </button>
            </div>

            {resumeSections.education.map((edu: any, index: number) => (
              <div key={edu.id || index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Education #{index + 1}</h4>
                  <button
                    onClick={() => removeEducation(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="University Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="Bachelor's Degree"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
                    <input
                      type="text"
                      value={edu.field_of_study}
                      onChange={(e) => updateEducation(index, 'field_of_study', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="Computer Science"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GPA/Grade</label>
                    <input
                      type="text"
                      value={edu.grade_gpa}
                      onChange={(e) => updateEducation(index, 'grade_gpa', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="3.8/4.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={edu.start_date}
                      onChange={(e) => updateEducation(index, 'start_date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={edu.end_date}
                      onChange={(e) => updateEducation(index, 'end_date', e.target.value)}
                      disabled={edu.is_current}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={edu.is_current}
                      onChange={(e) => updateEducation(index, 'is_current', e.target.checked)}
                      className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-400"
                    />
                    <span className="ml-2 text-sm text-gray-700">Currently studying here</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
              <button
                onClick={addExperience}
                className="inline-flex items-center px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </button>
            </div>

            {resumeSections.experience.map((exp: any, index: number) => (
              <div key={exp.id || index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Experience #{index + 1}</h4>
                  <button
                    onClick={() => removeExperience(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="Company Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => updateExperience(index, 'position', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="Job Title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => updateExperience(index, 'location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="City, State"
                    />
                  </div>

                  <div>
                    <label className="flex items-center mt-6">
                      <input
                        type="checkbox"
                        checked={exp.is_current}
                        onChange={(e) => updateExperience(index, 'is_current', e.target.checked)}
                        className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-400"
                      />
                      <span className="ml-2 text-sm text-gray-700">Currently working here</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={exp.start_date}
                      onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={exp.end_date}
                      onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                      disabled={exp.is_current}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Describe your responsibilities and achievements..."
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'certifications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Certifications</h3>
              <button
                onClick={addCertification}
                className="inline-flex items-center px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Certification
              </button>
            </div>

            {resumeSections.certifications.map((cert: any, index: number) => (
              <div key={cert.id || index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Certification #{index + 1}</h4>
                  <button
                    onClick={() => removeCertification(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Certification Name</label>
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => updateCertification(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="AWS Certified Solutions Architect"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Organization</label>
                    <input
                      type="text"
                      value={cert.issuing_organization}
                      onChange={(e) => updateCertification(index, 'issuing_organization', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="Amazon Web Services"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
                    <input
                      type="date"
                      value={cert.issue_date}
                      onChange={(e) => updateCertification(index, 'issue_date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                    <input
                      type="date"
                      value={cert.expiry_date}
                      onChange={(e) => updateCertification(index, 'expiry_date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Credential ID</label>
                    <input
                      type="text"
                      value={cert.credential_id}
                      onChange={(e) => updateCertification(index, 'credential_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="ABC123456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Credential URL</label>
                    <input
                      type="url"
                      value={cert.credential_url}
                      onChange={(e) => updateCertification(index, 'credential_url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="https://verify.example.com/cert/123"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
              <button
                onClick={addSkill}
                className="inline-flex items-center px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </button>
            </div>

            {resumeSections.skills.map((skill: any, index: number) => (
              <div key={skill.id || index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Skill #{index + 1}</h4>
                  <button
                    onClick={() => removeSkill(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skill Name</label>
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => updateSkill(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="JavaScript"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={skill.category}
                      onChange={(e) => updateSkill(index, 'category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    >
                      <option value="technical">Technical</option>
                      <option value="soft">Soft Skills</option>
                      <option value="language">Language</option>
                      <option value="tools">Tools</option>
                      <option value="frameworks">Frameworks</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Proficiency</label>
                    <select
                      value={skill.proficiency_level}
                      onChange={(e) => updateSkill(index, 'proficiency_level', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}