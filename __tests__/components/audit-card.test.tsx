import { render, screen } from '@testing-library/react'
import { AuditCard } from '@/components/audit-card'
import '@testing-library/jest-dom'

// Mock the Lucide icons to avoid potential issues in tests
jest.mock('lucide-react', () => ({
    Zap: () => <div data-testid="zap-icon" />,
    BarChart3: () => <div data-testid="bar-chart-icon" />,
    ExternalLink: () => <div data-testid="external-link-icon" />,
    Eye: () => <div data-testid="eye-icon" />,
    ImageIcon: () => <div data-testid="image-icon" />,
    Link2: () => <div data-testid="link-icon" />,
    Search: () => <div data-testid="search-icon" />,
    ArrowRight: () => <div data-testid="arrow-right-icon" />,
    FileText: () => <div data-testid="file-text-icon" />,
    CheckCircle2: () => <div data-testid="check-circle-icon" />,
    AlertTriangle: () => <div data-testid="alert-triangle-icon" />,
}))

// Mock Date to have consistent results
const mockDate = new Date('2025-12-19T00:00:00Z')

const mockAudit = {
    id: '1',
    url: 'https://example.com',
    status: 'completed' as const,
    created_at: mockDate.toISOString(),
    seoScore: 85,
    pageLoadTimeMs: 1200,
    internalLinks: 10,
    externalLinks: 5,
    imagesWithoutAlt: 2,
}

describe('AuditCard', () => {
    it('renders the SEO score correctly', () => {
        render(<AuditCard audit={mockAudit} />)
        expect(screen.getByText('85')).toBeInTheDocument()
        expect(screen.getByText('SEO Health Score')).toBeInTheDocument()
    })

    it('renders the URL and status correctly', () => {
        render(<AuditCard audit={mockAudit} />)
        expect(screen.getByText('https://example.com')).toBeInTheDocument()
        expect(screen.getByText('Completed')).toBeInTheDocument()
    })

    it('renders the speed metric', () => {
        render(<AuditCard audit={mockAudit} />)
        // Speed appears in two places: next to date and in a stat card
        const speedElements = screen.getAllByText(/1200ms/)
        expect(speedElements.length).toBeGreaterThan(0)
    })

    it('renders individual link counts', () => {
        render(<AuditCard audit={mockAudit} />)
        expect(screen.getByText('10')).toBeInTheDocument() // Internal
        expect(screen.getByText('5')).toBeInTheDocument()  // External
    })

    it('renders alt tags missing count', () => {
        render(<AuditCard audit={mockAudit} />)
        expect(screen.getByText('2 missing')).toBeInTheDocument()
    })
})
