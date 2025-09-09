'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

interface ErrorBoundaryProps {
    children: ReactNode;
    fallbackMessage?: string;
    showErrorDetails?: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error Boundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo,
        });
    }

    private getErrorMessage(): string {
        const { error } = this.state;
        const { fallbackMessage } = this.props;

        if (!error) {
            return fallbackMessage || 'An unexpected error occurred';
        }

        // Extract meaningful error messages
        let errorMessage = error.message || 'Unknown error occurred';

        // Handle common error patterns
        if (error.name === 'ChunkLoadError') {
            errorMessage = 'Failed to load application resources. Please refresh the page.';
        } else if (error.message.includes('Loading chunk')) {
            errorMessage = 'Application update detected. Please refresh the page.';
        } else if (error.message.includes('ResizeObserver loop limit exceeded')) {
            errorMessage = 'Display rendering issue detected. Please refresh the page.';
        } else if (error.message.includes('Non-Error promise rejection captured')) {
            errorMessage = 'A network request failed. Please check your connection and try again.';
        }

        return errorMessage;
    }

    private handleRefresh = () => {
        window.location.reload();
    };

    private handleReset = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    render() {
        if (this.state.hasError) {
            const errorMessage = this.getErrorMessage();
            const { showErrorDetails = false } = this.props;

            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
                            <svg
                                className="w-8 h-8 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                        </div>

                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Oops! Something went wrong
                            </h3>

                            <div className="mb-6">
                                <p className="text-sm text-gray-600 mb-3">
                                    {errorMessage}
                                </p>

                                {showErrorDetails && this.state.error && (
                                    <details className="text-left">
                                        <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700 mb-2">
                                            Technical Details
                                        </summary>
                                        <div className="bg-gray-100 rounded p-3 text-xs font-mono text-gray-700 max-h-32 overflow-auto">
                                            <div className="mb-2">
                                                <strong>Error:</strong> {this.state.error.name}
                                            </div>
                                            <div className="mb-2">
                                                <strong>Message:</strong> {this.state.error.message}
                                            </div>
                                            {this.state.error.stack && (
                                                <div>
                                                    <strong>Stack:</strong>
                                                    <pre className="whitespace-pre-wrap text-xs mt-1">
                                                        {this.state.error.stack.split('\n').slice(0, 5).join('\n')}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    </details>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={this.handleRefresh}
                                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        />
                                    </svg>
                                    Refresh Page
                                </button>

                                <button
                                    onClick={this.handleReset}
                                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                        />
                                    </svg>
                                    Try Again
                                </button>
                            </div>

                            <p className="text-xs text-gray-500 mt-4">
                                If this problem persists, please contact support.
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
