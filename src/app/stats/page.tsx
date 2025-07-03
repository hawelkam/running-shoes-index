import Link from "next/link";

export default function StatsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <header className="mb-8">
        <nav className="mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span>&gt;</span>
            <span className="text-gray-800">Statistics</span>
          </div>
        </nav>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Running Shoes Statistics
        </h1>
        <p className="text-lg text-gray-600">
          Explore detailed statistics and analytics about running shoes releases and trends
        </p>
      </header>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 2025 H1 Statistics */}
        <Link
          href="/stats/2025-h1"
          className="group bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors ml-3">
              2025 First Half
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            Statistics for shoes released in Poland from January to June 2025, including overall trends and daily trainer analysis.
          </p>
          <div className="text-sm text-gray-500">
            • Average drop and weight analysis<br />
            • Price comparisons (PLN & EUR)<br />
            • Daily trainer category breakdown
          </div>
        </Link>

        {/* Placeholder for future stats */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-gray-200 p-3 rounded-lg">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-500 ml-3">
              Brand Analysis
            </h3>
          </div>
          <p className="text-gray-500 mb-4">
            Coming soon: Detailed brand performance analysis and market share statistics.
          </p>
          <div className="text-sm text-gray-400">
            • Release frequency by brand<br />
            • Price positioning analysis<br />
            • Category distribution
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-gray-200 p-3 rounded-lg">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-500 ml-3">
              Yearly Trends
            </h3>
          </div>
          <p className="text-gray-500 mb-4">
            Coming soon: Year-over-year comparison and trending analysis for running shoe specifications.
          </p>
          <div className="text-sm text-gray-400">
            • Weight evolution trends<br />
            • Drop preference changes<br />
            • Price inflation analysis
          </div>
        </div>
      </div>

      {/* Quick Facts */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">About Our Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <div>
            <h3 className="font-semibold mb-2">Data Sources</h3>
            <p className="text-sm">
              Our statistics are compiled from official brand releases, retailer data, 
              and verified product specifications. All data is regularly updated and 
              cross-referenced for accuracy.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Methodology</h3>
            <p className="text-sm">
              We use standardized calculation methods across all statistics, 
              excluding outliers and ensuring consistent data quality. 
              Only shoes with complete specification data are included in averages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
