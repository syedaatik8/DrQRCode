import React from 'react'
import { X, Mail, MessageCircle, Search, BookOpen, Zap, Shield, Users } from 'lucide-react'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

const faqs = [
  {
    question: "How do I create a QR code for my resume?",
    answer: "Go to the Resume Builder, fill out your information, and save your resume. A QR code will be automatically generated that links to your online resume.",
    category: "resume",
    icon: BookOpen
  },
  {
    question: "Can I customize the design of my resume?",
    answer: "Yes! We offer 4 different templates: Classic, Modern, Minimal, and Creative. Click 'Select Template' in the Resume Builder to choose your preferred design.",
    category: "design",
    icon: Zap
  },
  {
    question: "How do I generate multiple QR codes at once?",
    answer: "Use our Bulk QR Generator feature. Go to Generate QR Code page and click 'Generate Bulk QR Codes'. Enter multiple URLs (one per line) and generate up to 50 QR codes simultaneously.",
    category: "bulk",
    icon: Users
  },
  {
    question: "What formats can I download QR codes in?",
    answer: "You can download QR codes in PNG or JPG formats. Premium users also get access to SVG format and high-resolution downloads up to 1000x1000 pixels.",
    category: "download",
    icon: Zap
  },
  {
    question: "Is my resume data secure?",
    answer: "Yes, your data is completely secure. We use industry-standard encryption and your resume data is stored securely in our database. Only you can access and modify your resume.",
    category: "security",
    icon: Shield
  },
  {
    question: "Can I make my resume private?",
    answer: "Your resume is only accessible via the unique QR code URL. You can deactivate your resume at any time from the Resume Builder settings to make it inaccessible.",
    category: "privacy",
    icon: Shield
  },
  {
    question: "How do I update my resume after creating it?",
    answer: "Simply go back to the Resume Builder, make your changes, and click Save. Your QR code will continue to work and will show the updated information.",
    category: "resume",
    icon: BookOpen
  },
  {
    question: "What's the difference between free and premium plans?",
    answer: "Free users can create resumes and basic QR codes. Premium users get access to high-resolution downloads, SVG format, advanced analytics, custom colors, and priority support.",
    category: "plans",
    icon: Zap
  },
  {
    question: "Can I use my own domain for the resume URL?",
    answer: "This feature is available for Enterprise users. Contact us to learn more about custom domain options and white-label solutions.",
    category: "enterprise",
    icon: Users
  },
  {
    question: "How do I delete my account and data?",
    answer: "You can delete your account from the Settings page. This will permanently remove all your data including resumes and QR codes. This action cannot be undone.",
    category: "account",
    icon: Shield
  }
]

const categories = [
  { id: 'all', label: 'All Topics', icon: BookOpen },
  { id: 'resume', label: 'Resume Builder', icon: BookOpen },
  { id: 'design', label: 'Design & Templates', icon: Zap },
  { id: 'bulk', label: 'Bulk Generation', icon: Users },
  { id: 'security', label: 'Security & Privacy', icon: Shield },
  { id: 'plans', label: 'Plans & Features', icon: Zap }
]

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = React.useState('all')
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Help & Support</h2>
              <p className="text-gray-800 mt-1">Find answers to common questions and get support</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-800 hover:text-gray-900 transition-colors p-2 hover:bg-white/20 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-80 bg-gray-50 border-r border-gray-200 p-6">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors"
              />
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Categories</h3>
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all ${
                      selectedCategory === category.id
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{category.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-8 overflow-y-auto">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-500">Try adjusting your search or browse different categories</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {selectedCategory === 'all' ? 'All Help Topics' : categories.find(c => c.id === selectedCategory)?.label}
                  </h3>
                  <p className="text-gray-600">{filteredFaqs.length} article{filteredFaqs.length !== 1 ? 's' : ''} found</p>
                </div>

                {filteredFaqs.map((faq, index) => {
                  const Icon = faq.icon
                  return (
                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                            <Icon className="w-5 h-5 text-yellow-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-3 text-lg">{faq.question}</h4>
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-8 py-6">
          <div className="text-center">
            <h4 className="font-semibold text-gray-900 mb-4">Still need help?</h4>
            <div className="flex justify-center gap-4">
              <button className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm">
                <Mail className="w-4 h-4 mr-2" />
                Email Support
              </button>
              <button className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors shadow-sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Live Chat
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              We typically respond within 24 hours. Premium users get priority support.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}