import React from 'react'
import { X, Mail, MessageCircle } from 'lucide-react'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

const faqs = [
  {
    question: "How do I create a QR code for my resume?",
    answer: "Go to the Resume Builder, fill out your information, and save your resume. A QR code will be automatically generated that links to your online resume."
  },
  {
    question: "Can I customize the design of my resume?",
    answer: "Yes! We offer 4 different templates: Classic, Modern, Minimal, and Creative. Click 'Select Template' in the Resume Builder to choose your preferred design."
  },
  {
    question: "How do I generate multiple QR codes at once?",
    answer: "Use our Bulk QR Generator feature. Go to Generate QR Code page and click 'Generate Bulk QR Codes'. Enter multiple URLs (one per line) and generate up to 50 QR codes simultaneously."
  },
  {
    question: "What formats can I download QR codes in?",
    answer: "You can download QR codes in PNG or JPG formats. Premium users also get access to SVG format and high-resolution downloads up to 1000x1000 pixels."
  },
  {
    question: "Is my resume data secure?",
    answer: "Yes, your data is completely secure. We use industry-standard encryption and your resume data is stored securely in our database. Only you can access and modify your resume."
  },
  {
    question: "Can I make my resume private?",
    answer: "Your resume is only accessible via the unique QR code URL. You can deactivate your resume at any time from the Resume Builder settings to make it inaccessible."
  },
  {
    question: "How do I update my resume after creating it?",
    answer: "Simply go back to the Resume Builder, make your changes, and click Save. Your QR code will continue to work and will show the updated information."
  },
  {
    question: "What's the difference between free and premium plans?",
    answer: "Free users can create resumes and basic QR codes. Premium users get access to high-resolution downloads, SVG format, advanced analytics, custom colors, and priority support."
  },
  {
    question: "Can I use my own domain for the resume URL?",
    answer: "This feature is available for Enterprise users. Contact us to learn more about custom domain options and white-label solutions."
  },
  {
    question: "How do I delete my account and data?",
    answer: "You can delete your account from the Settings page. This will permanently remove all your data including resumes and QR codes. This action cannot be undone."
  }
]

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Help & Support</h2>
            <p className="text-sm text-gray-600 mt-1">Frequently asked questions and support options</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
            
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="text-center">
            <h4 className="font-medium text-gray-900 mb-4">Still need help?</h4>
            <div className="flex justify-center gap-4">
              <button className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                <Mail className="w-4 h-4 mr-2" />
                Email Support
              </button>
              <button className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
                <MessageCircle className="w-4 h-4 mr-2" />
                Live Chat
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              We typically respond within 24 hours. Premium users get priority support.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}