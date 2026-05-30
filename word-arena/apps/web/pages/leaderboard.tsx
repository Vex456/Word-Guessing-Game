import React, { useState, useEffect } from 'react';
import Head from 'next/head';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setLeaderboard([
        { rank: 1, name: 'Alex', points: 1250, wins: 25, winRate: 65 },
        { rank: 2, name: 'Taylor', points: 1100, wins: 22, winRate: 60 },
        { rank: 3, name: 'Jordan', points: 980, wins: 19, winRate: 55 },
        { rank: 4, name: 'Casey', points: 870, wins: 18, winRate: 52 },
        { rank: 5, name: 'Morgan', points: 760, wins: 16, winRate: 48 },
        { rank: 6, name: 'Riley', points: 650, wins: 14, winRate: 45 },
        { rank: 7, name: 'Quinn', points: 540, wins: 12, winRate: 42 },
        { rank: 8, name: 'Avery', points: 430, wins: 10, winRate: 40 },
        { rank: 9, name: 'Peyton', points: 320, wins: 8, winRate: 38 },
        { rank: 10, name: 'Skyler', points: 210, wins: 6, winRate: 35 },
      ]);
    }, 500);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      <Head>
        <title>Word Arena - Leaderboard</title>
        <meta name="description" content="Global leaderboard for Word Arena" />
      </Head>

      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            Global Leaderboard
          </h1>
          <p className="text-gray-600">Top players in the Word Arena</p>
        </header>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-6 text-left font-semibold text-gray-700">Rank</th>
                <th className="py-4 px-6 text-left font-semibold text-gray-700">Player</th>
                <th className="py-4 px-6 text-left font-semibold text-gray-700">Points</th>
                <th className="py-4 px-6 text-left font-semibold text-gray-700">Wins</th>
                <th className="py-4 px-6 text-left font-semibold text-gray-700">Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((player) => (
                <tr 
                  key={player.rank} 
                  className={`border-t border-gray-100 ${
                    player.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''
                  }`}
                >
                  <td className="py-4 px-6">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${
                      player.rank === 1 ? 'bg-yellow-500 text-white' :
                      player.rank === 2 ? 'bg-gray-400 text-white' :
                      player.rank === 3 ? 'bg-amber-700 text-white' :
                      'bg-gray-200 text-gray-700'
                    }`}>
                      {player.rank}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
                        {player.name.charAt(0)}
                      </div>
                      {player.name}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-blue-600">{player.points}</td>
                  <td className="py-4 px-6">{player.wins}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      player.winRate >= 60 ? 'bg-green-100 text-green-800' :
                      player.winRate >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {player.winRate}%
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
};

export default LeaderboardPage;
