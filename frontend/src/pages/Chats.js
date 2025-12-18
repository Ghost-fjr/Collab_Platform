// src/pages/Chats.js
// -----------------------------------------------------------------------------
// Chat Interface
// - Displays list of chat rooms
// - Real-time messaging interface
// - Support for project and direct message rooms
// -----------------------------------------------------------------------------
import React, { useEffect, useState, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import styles from './Chats.module.css';

export default function Chats() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { showToast } = useToast();

  // ---------------------------------------------------------------------------
  // Fetch all chat rooms
  // ---------------------------------------------------------------------------
  const fetchRooms = useCallback(async () => {
    try {
      const res = await axiosClient.get('/chat-rooms/');
      setRooms(res.data.results || res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load chat rooms', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // ---------------------------------------------------------------------------
  // Fetch messages for a room
  // ---------------------------------------------------------------------------
  const fetchMessages = useCallback(async (roomId) => {
    try {
      const res = await axiosClient.get(`/chat-rooms/${roomId}/`);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load messages', 'error');
    }
  }, [showToast]);

  // ---------------------------------------------------------------------------
  // Fetch chat rooms on mount
  // ---------------------------------------------------------------------------
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // ---------------------------------------------------------------------------
  // Fetch messages when room is selected
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom.id);
    }
  }, [selectedRoom, fetchMessages]);

  // ---------------------------------------------------------------------------
  // Send a new message
  // ---------------------------------------------------------------------------
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom) return;

    setSending(true);
    try {
      await axiosClient.post('/messages/', {
        room: selectedRoom.id,
        content: newMessage,
      });
      setNewMessage('');
      fetchMessages(selectedRoom.id); // Refresh messages
    } catch (err) {
      console.error(err);
      showToast('Failed to send message', 'error');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        {/* Sidebar - Room List */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>Chats</h2>
          </div>

          <div className={styles.roomList}>
            {rooms.length === 0 ? (
              <p className={styles.empty}>No chat rooms available</p>
            ) : (
              rooms.map((room) => (
                <div
                  key={room.id}
                  className={`${styles.roomCard} ${selectedRoom?.id === room.id ? styles.roomCardActive : ''
                    }`}
                  onClick={() => setSelectedRoom(room)}
                >
                  <div className={styles.roomInfo}>
                    <h3 className={styles.roomName}>{room.name}</h3>
                    {room.last_message && (
                      <p className={styles.lastMessage}>
                        {room.last_message.sender}: {room.last_message.content}
                      </p>
                    )}
                  </div>
                  {room.unread_count > 0 && (
                    <span className={styles.unreadBadge}>{room.unread_count}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className={styles.chatArea}>
          {selectedRoom ? (
            <>
              {/* Chat Header */}
              <div className={styles.chatHeader}>
                <h2 className={styles.chatTitle}>{selectedRoom.name}</h2>
                <span className={styles.roomType}>{selectedRoom.room_type}</span>
              </div>

              {/* Messages */}
              <div className={styles.messageList}>
                {messages.length === 0 ? (
                  <p className={styles.empty}>No messages yet. Start the conversation!</p>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={styles.message}>
                      <div className={styles.messageHeader}>
                        <span className={styles.messageSender}>
                          {msg.sender?.username || 'Unknown'}
                        </span>
                        <span className={styles.messageTime}>
                          {new Date(msg.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className={styles.messageContent}>{msg.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className={styles.messageForm}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className={styles.messageInput}
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className={styles.sendButton}
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </form>
            </>
          ) : (
            <div className={styles.emptyChat}>
              <p>Select a chat room to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
