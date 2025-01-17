import { useState } from 'react'
import { remixText } from './api/claude'
function App() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRemix = async () => {
    if (!inputText.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await remixText(inputText)
      setOutputText(result)
    } catch (err) {
      setError('Failed to remix text. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-5xl font-bold text-center mb-8">Content Remixer</h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Input Text
            </label>
            <textarea
              className="w-full h-40 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleRemix}
            disabled={isLoading || !inputText.trim()}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Remixing...' : 'Remix Content'}
          </button>

          {outputText && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Remixed Output
              </label>
              <div className="w-full min-h-40 p-3 bg-white border rounded-lg shadow-sm">
                {outputText}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default App
