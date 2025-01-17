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

  const handleTweet = async (tweet: string, index: number) => {
    try {
      // Copy to clipboard
      await navigator.clipboard.writeText(tweet);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      
      // Open Twitter with pre-filled text
      const encodedTweet = encodeURIComponent(tweet);
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTweet}`;
      window.open(twitterUrl, '_blank');
    } catch (err) {
      console.error('Failed to handle tweet:', err);
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
                      onClick={() => handleTweet(tweet, index)}
                      className="flex items-center gap-2 text-sm px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                    >
                      <svg 
                        className="w-4 h-4" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                      {copiedIndex === index ? 'Opening Twitter...' : 'Tweet'}
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
