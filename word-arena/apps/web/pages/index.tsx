import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const HomePage = () => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('male1');

  const avatars = [
    { id: 'male1', name: 'Male 1', color: 'bg-blue-500' },
    { id: 'male2', name: 'Male 2', color: 'bg-blue-700' },
    { id: 'female1', name: 'Female 1', color: 'bg-pink-500' },
    { id: 'female2', name: 'Female 2', color: 'bg-pink-700' },
    { id: 'robot', name: 'Robot', color: 'bg-gray-500' },
    { id: 'wizard', name: 'Wizard', color: 'bg-purple-500' },
    { id: 'ninja', name: 'Ninja', color: 'bg-black' },
    { id: 'alien', name: 'Alien', color: 'bg-green-500' },
  ];

  const handleStartGame = () => {
    if (!name.trim()) {
      alert('Please enter a name');
      return;
    }

    localStorage.setItem('playerName', name);
    localStorage.setItem('playerAvatar', selectedAvatar);
    window.location.href = '/lobby';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-4">
      <Head>
        <title>Word Arena - Home</title>
        <meta name="description" content="Multiplayer word game arena" />
      </Head>

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            Word Arena
          </h1>
          <p className="text-gray-600">Enter the arena and battle with words!</p>
        </div>

        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Enter Your Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Your display name"
            maxLength={20}
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Choose Your Avatar
          </label>
          <div className="grid grid-cols-4 gap-4">
            {avatars.map((avatar) => (
              <div
                key={avatar.id}
                onClick={() => setSelectedAvatar(avatar.id)}
                className={`flex flex-col items-center cursor-pointer p-3 rounded-xl border-2 ${
                  selectedAvatar === avatar.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`${avatar.color} w-12 h-12 rounded-full flex items-center justify-center mb-2`}>
                  <span className="text-white font-bold text-lg">{avatar.name.charAt(0)}</span>
                </div>
                <span className="text-xs text-gray-600">{avatar.name}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleStartGame}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-105"
        >
          Enter Arena
        </button>

        <div className="mt-6 text-center">
          <Link href="/leaderboard" className="text-blue-600 hover:text-blue-800 text-sm">
            View Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
