import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Head from 'next/head';

const LobbyPage = () => {
  const [socket, setSocket] = useState<any>(null);
  const [player, setPlayer] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const emojis = ['😀', '😂', '🔥', '❤️', '🎉', '😎', '👍', '👏', '🙌', '💯'];

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const newSocket = io(API_URL);
    setSocket(newSocket);

    const playerName = localStorage.getItem('playerName');
    const playerAvatar = localStorage.getItem('playerAvatar');

    if (!playerName || !playerAvatar) {
      window.location.href = '/';
      return;
    }

    const lobbyId = 'main-lobby';
    newSocket.emit('joinLobby', {
      lobbyId,
      displayName: playerName,
      avatarId: playerAvatar,
    });

    newSocket.on('lobbyUpdate', (data: any) => {
      setPlayers(data.players);
      if (data.players.some((p: any) => p.displayName === playerName)) {
        const currentPlayer = data.players.find((p: any) => p.displayName === playerName);
        setPlayer(currentPlayer);
        setIsReady(currentPlayer.isReady);
      }
    });

    newSocket.on('chatMessage', (message: any) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('matchStarted', (match: any) => {
      window.location.href = `/match/${match.id}`;
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    socket.emit('sendChatMessage', {
      message: newMessage,
    });

    setNewMessage('');
  };

  const handleToggleReady = () => {
    if (!socket) return;
    socket.emit('setReady', { isReady: !isReady });
    setIsReady(!isReady);
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      <Head>
        <title>Word Arena - Lobby</title>
        <meta name="description" content="Virtual lobby for Word Arena" />
      </Head>

      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Word Arena Lobby
          </h1>
          <div className="flex items-center space-x-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              Players: {players.length}/5
            </span>
            <button
              onClick={handleToggleReady}
              className={`px-4 py-2 rounded-lg font-semibold ${
                isReady
                  ? 'bg-green-500 text-white'
                  : 'bg-yellow-500 text-white hover:bg-yellow-600'
              }`}
            >
              {isReady ? 'Ready ✓' : 'Ready Up'}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Virtual Lobby</h2>
            <div className="relative h-96 bg-gradient-to-b from-blue-100 to-purple-100 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden">
              {players.map((p, index) => (
                <div
                  key={p.id}
                  className="absolute flex flex-col items-center"
                  style={{
                    top: `${20 + (index * 15)}%`,
                    left: `${20 + (index * 15)}%`,
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mb-1">
                    {p.displayName.charAt(0)}
                  </div>
                  <span className="text-xs bg-white px-2 py-1 rounded shadow text-gray-700">
                    {p.displayName}
                    {p.isReady && <span className="ml-1 text-green-500">✓</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Chat Room</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 h-80">
              {messages.map((msg, index) => (
                <div key={index} className="mb-3">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2 flex-shrink-0">
                      <span className="text-sm">{msg.displayName.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{msg.displayName}</div>
                      <div className="text-gray-700">{msg.message}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 border-t">
              <div className="relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-12"
                  placeholder="Type a message..."
                />
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute right-10 top-1/2 transform -translate-y-1/2 text-xl"
                >
                  😊
                </button>
                <button
                  onClick={handleSendMessage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
              
              {showEmojiPicker && (
                <div className="absolute bottom-full mb-2 left-0 right-0 bg-white border rounded-lg p-2 shadow-lg z-10">
                  <div className="grid grid-cols-5 gap-1">
                    {emojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => addEmoji(emoji)}
                        className="text-2xl hover:bg-gray-100 rounded p-1"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white rounded-xl p-4 shadow text-center hover:shadow-md transition">
            <div className="text-2xl mb-2">🏆</div>
            <div className="font-semibold">Leaderboard</div>
          </button>
          <button className="bg-white rounded-xl p-4 shadow text-center hover:shadow-md transition">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold">Stats</div>
          </button>
          <button className="bg-white rounded-xl p-4 shadow text-center hover:shadow-md transition">
            <div className="text-2xl mb-2">👤</div>
            <div className="font-semibold">Profile</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LobbyPage;
