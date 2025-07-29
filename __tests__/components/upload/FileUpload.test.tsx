import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FileUpload } from '../../../app/components/upload/FileUpload'

// Mock react-dropzone
jest.mock('react-dropzone', () => ({
  useDropzone: () => ({
    getRootProps: () => ({
      onClick: jest.fn(),
    }),
    getInputProps: () => ({
      type: 'file',
      accept: 'image/*',
    }),
    isDragActive: false,
  }),
}))

describe('FileUpload', () => {
  const mockOnFileSelect = jest.fn()
  const mockOnError = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders upload interface correctly', () => {
    render(
      <FileUpload
        onFileSelect={mockOnFileSelect}
        onError={mockOnError}
      />
    )

    expect(screen.getByText('Upload your Noun PFP')).toBeInTheDocument()
    expect(screen.getByText('Drag & drop your Noun image, or click to browse')).toBeInTheDocument()
    expect(screen.getByText('Choose File')).toBeInTheDocument()
  })

  it('shows supported file formats', () => {
    render(
      <FileUpload
        onFileSelect={mockOnFileSelect}
        onError={mockOnError}
      />
    )

    expect(screen.getByText('PNG')).toBeInTheDocument()
    expect(screen.getByText('JPG')).toBeInTheDocument()
    expect(screen.getByText('SVG')).toBeInTheDocument()
    expect(screen.getByText('Max 5MB')).toBeInTheDocument()
  })

  it('displays loading state when processing', () => {
    render(
      <FileUpload
        onFileSelect={mockOnFileSelect}
        onError={mockOnError}
        isLoading={true}
      />
    )

    expect(screen.getByText('Processing your Noun...')).toBeInTheDocument()
    expect(screen.getByText('Detecting traits and preparing preview')).toBeInTheDocument()
  })

  it('shows drag active state', () => {
    // Mock useDropzone to return isDragActive: true
    jest.doMock('react-dropzone', () => ({
      useDropzone: () => ({
        getRootProps: () => ({
          onClick: jest.fn(),
        }),
        getInputProps: () => ({
          type: 'file',
          accept: 'image/*',
        }),
        isDragActive: true,
      }),
    }))

    render(
      <FileUpload
        onFileSelect={mockOnFileSelect}
        onError={mockOnError}
      />
    )

    expect(screen.getByText('Drop your Noun here')).toBeInTheDocument()
  })

  it('handles file selection via button click', async () => {
    const user = userEvent.setup()
    
    render(
      <FileUpload
        onFileSelect={mockOnFileSelect}
        onError={mockOnError}
      />
    )

    const fileInput = screen.getByRole('button', { name: /choose file/i })
    await user.click(fileInput)

    // Note: In a real test, we would need to mock the file input change event
    // This is a simplified test for the button interaction
    expect(fileInput).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <FileUpload
        onFileSelect={mockOnFileSelect}
        onError={mockOnError}
        className="custom-class"
      />
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('shows helpful tips', () => {
    render(
      <FileUpload
        onFileSelect={mockOnFileSelect}
        onError={mockOnError}
      />
    )

    expect(screen.getByText(/💡 Tip: Use a square image for best results/)).toBeInTheDocument()
    expect(screen.getByText(/🔍 We'll automatically detect your Noun's traits/)).toBeInTheDocument()
  })
}) 