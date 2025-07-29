import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UploadStudio } from '../../../app/components/upload/UploadStudio'

// Mock child components
jest.mock('../../../app/components/upload/FileUpload', () => ({
  FileUpload: ({ onFileSelect, onError, isLoading }: any) => (
    <div data-testid="file-upload">
      <button onClick={() => onFileSelect(new File(['test'], 'test.png', { type: 'image/png' }))}>
        Upload File
      </button>
      {isLoading && <div>Loading...</div>}
    </div>
  ),
}))

jest.mock('../../../app/components/upload/NounDetector', () => ({
  NounDetector: ({ onTraitsDetected, onError }: any) => (
    <div data-testid="noun-detector">
      <button onClick={() => onTraitsDetected({ eyes: 'normal', noggles: 'original', background: 'blue', body: 'normal', head: 'normal' })}>
        Detect Traits
      </button>
    </div>
  ),
}))

jest.mock('../../../app/components/upload/ImagePreview', () => ({
  ImagePreview: ({ onExport, onError }: any) => (
    <div data-testid="image-preview">
      <button onClick={() => onExport('data:image/png;base64,mock-gif')}>
        Export GIF
      </button>
    </div>
  ),
}))

jest.mock('../../../app/components/analytics/Tracking', () => ({
  useTracking: () => ({
    uploadStart: jest.fn(),
    traitsDetected: jest.fn(),
    exportComplete: jest.fn(),
    downloadStart: jest.fn(),
  }),
}))

describe('UploadStudio', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders file upload initially', () => {
    render(<UploadStudio />)
    
    expect(screen.getByTestId('file-upload')).toBeInTheDocument()
  })

  it('shows progress steps', () => {
    render(<UploadStudio />)
    
    expect(screen.getByText('Upload')).toBeInTheDocument()
    expect(screen.getByText('Detect')).toBeInTheDocument()
    expect(screen.getByText('Preview')).toBeInTheDocument()
    expect(screen.getByText('Export')).toBeInTheDocument()
  })

  it('transitions from upload to detection step', async () => {
    render(<UploadStudio />)
    
    const uploadButton = screen.getByText('Upload File')
    await user.click(uploadButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('noun-detector')).toBeInTheDocument()
    })
  })

  it('transitions from detection to preview step', async () => {
    render(<UploadStudio />)
    
    // Go through upload step
    const uploadButton = screen.getByText('Upload File')
    await user.click(uploadButton)
    
    // Go through detection step
    const detectButton = screen.getByText('Detect Traits')
    await user.click(detectButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('image-preview')).toBeInTheDocument()
    })
  })

  it('transitions to export step', async () => {
    render(<UploadStudio />)
    
    // Go through all steps
    const uploadButton = screen.getByText('Upload File')
    await user.click(uploadButton)
    
    const detectButton = screen.getByText('Detect Traits')
    await user.click(detectButton)
    
    const exportButton = screen.getByText('Export GIF')
    await user.click(exportButton)
    
    await waitFor(() => {
      expect(screen.getByText('Your Animated Noun is Ready!')).toBeInTheDocument()
    })
  })

  it('shows download and create another buttons in export step', async () => {
    render(<UploadStudio />)
    
    // Go through all steps
    const uploadButton = screen.getByText('Upload File')
    await user.click(uploadButton)
    
    const detectButton = screen.getByText('Detect Traits')
    await user.click(detectButton)
    
    const exportButton = screen.getByText('Export GIF')
    await user.click(exportButton)
    
    await waitFor(() => {
      expect(screen.getByText('Download Animated Noun')).toBeInTheDocument()
      expect(screen.getByText('Create Another')).toBeInTheDocument()
    })
  })

  it('resets to upload step when create another is clicked', async () => {
    render(<UploadStudio />)
    
    // Go through all steps
    const uploadButton = screen.getByText('Upload File')
    await user.click(uploadButton)
    
    const detectButton = screen.getByText('Detect Traits')
    await user.click(detectButton)
    
    const exportButton = screen.getByText('Export GIF')
    await user.click(exportButton)
    
    // Click create another
    const createAnotherButton = screen.getByText('Create Another')
    await user.click(createAnotherButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('file-upload')).toBeInTheDocument()
    })
  })

  it('applies custom className', () => {
    const { container } = render(<UploadStudio className="custom-class" />)
    
    expect(container.firstChild).toHaveClass('custom-class')
  })
}) 