"use client";

export default function TokenBreakdownChart({ data }) {
  if (!data || !data.allocation_percent || !data.var_99_per_ticker) return null;

  const chartData = Object.keys(data.allocation_percent).map((token) => ({
    token,
    allocation: data.allocation_percent[token],
    var99: data.var_99_per_ticker[token],
  }));

  const COLOR_PALETTE = [
    "#f59e0b",
    "#10b981",
    "#ef4444",
    "#8b5cf6",
    "#3b82f6",
    "#06b6d4",
    "#f97316",
    "#84cc16",
    "#ec4899",
    "#6366f1",
    "#14b8a6",
    "#f59e0b",
    "#8b5cf6",
    "#ef4444",
    "#10b981",
  ];

  const getTokenColor = (token, index) => {
    const hash = token.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return COLOR_PALETTE[Math.abs(hash) % COLOR_PALETTE.length];
  };

  return (
    <div className="w-full space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Portfolio Analytics
        </h1>
        <p className="text-gray-600">
          Token allocation and risk metrics overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            Total Tokens
          </h3>
          <p className="text-2xl font-bold text-gray-800">{chartData.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            Largest Holding
          </h3>
          <p className="text-2xl font-bold text-gray-800">
            {
              chartData.reduce(
                (max, token) =>
                  token.allocation > max.allocation ? token : max,
                chartData[0]
              )?.token
            }
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            Highest VaR
          </h3>
          <p className="text-2xl font-bold text-red-600">
            {Math.max(...chartData.map((d) => d.var99)).toFixed(1)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Avg VaR</h3>
          <p className="text-2xl font-bold text-orange-600">
            {(
              chartData.reduce((sum, d) => sum + d.var99, 0) / chartData.length
            ).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Token Details Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">Token Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Token
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Allocation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  VaR 99%
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {chartData
                .sort((a, b) => b.allocation - a.allocation)
                .map((token, index) => (
                  <tr
                    key={token.token}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded mr-3"
                          style={{
                            backgroundColor: getTokenColor(token.token, index),
                          }}
                        />
                        <span className="font-medium text-gray-900">
                          {token.token}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${
                                (token.allocation /
                                  Math.max(
                                    ...chartData.map((d) => d.allocation)
                                  )) *
                                100
                              }%`,
                              backgroundColor: getTokenColor(
                                token.token,
                                index
                              ),
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {token.allocation.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {token.var99.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          token.var99 > 6
                            ? "bg-red-100 text-red-800"
                            : token.var99 > 4
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {token.var99 > 6
                          ? "High"
                          : token.var99 > 4
                          ? "Medium"
                          : "Low"}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
