import { useState } from 'react'
import { remixText } from './api/claude'

function App() {
  const [inputText, setInputText] = useState('')
  const [outputTweets, setOutputTweets] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleRemix = async () => {
    if (!inputText.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const results = await remixText(inputText)
      setOutputTweets(results)
    } catch (err) {
      setError('Failed to remix text. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyTweet = async (tweet: string, index: number) => {
    try {
      await navigator.clipboard.writeText(tweet)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy tweet:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
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
            {isLoading ? 'Remixing...' : 'Generate Tweet Variations'}
          </button>

          {outputTweets.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {outputTweets.map((tweet, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-start mb-2">
                    <label className="text-sm font-medium">
                      Version {index + 1}
                    </label>
                    <button
                      onClick={() => handleCopyTweet(tweet, index)}
                      className="text-sm px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                    >
                      {copiedIndex === index ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-gray-800 whitespace-pre-wrap">{tweet}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    {tweet.length}/280 characters
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
