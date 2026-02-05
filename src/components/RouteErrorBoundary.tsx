import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class RouteErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Route error:', error, errorInfo)
  }

  private BackButton = () => {
    const navigate = useNavigate()
    return (
      <Button
        variant="outline"
        icon={<ArrowLeft className="h-4 w-4" />}
        onClick={() => navigate(-1)}
      >
        Go Back
      </Button>
    )
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Page Error
            </h2>
            
            <p className="text-gray-600 mb-6">
              There was a problem loading this page. Please try going back or reload the page.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <this.BackButton />
              <Button
                variant="primary"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default RouteErrorBoundary