"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, Video, MessageSquare, Share2, Clock, Lock, Globe, Copy, Check, X, UserPlus, Settings, Mic, MicOff, VideoOff, Phone } from "lucide-react";
import Link from "next/link";

interface StudyRoom {
  id: string;
  name: string;
  subject: string;
  color: string;
  host: string;
  participants: string[];
  maxParticipants: number;
  isPrivate: boolean;
  createdAt: string;
  status: "active" | "scheduled" | "ended";
  description: string;
  roomCode: string;
}

export default function StudyRoomsPage() {
  const [rooms, setRooms] = useState<StudyRoom[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeRoom, setActiveRoom] = useState<StudyRoom | null>(null);
  const [joinCode, setJoinCode] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  
  // Video call states
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{user: string, message: string, time: string}>>([]);
  const [newMessage, setNewMessage] = useState("");

  // Form states
  const [roomName, setRoomName] = useState("");
  const [roomSubject, setRoomSubject] = useState("General Study");
  const [roomDescription, setRoomDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [maxParticipants, setMaxParticipants] = useState(4);

  useEffect(() => {
    // Load rooms from localStorage
    const storedRooms = localStorage.getItem("studyforge_study_rooms");
    if (storedRooms) {
      setRooms(JSON.parse(storedRooms));
    } else {
      // Create some demo rooms
      const demoRooms: StudyRoom[] = [
        {
          id: "room_1",
          name: "Calculus Study Group",
          subject: "Mathematics",
          color: "#EC4899",
          host: "You",
          participants: ["You", "Alice", "Bob"],
          maxParticipants: 6,
          isPrivate: false,
          createdAt: new Date().toISOString(),
          status: "active",
          description: "Working through Chapter 5 problems together",
          roomCode: "CALC2024"
        },
        {
          id: "room_2",
          name: "CS Algorithms Prep",
          subject: "Computer Science",
          color: "#8B5CF6",
          host: "Sarah",
          participants: ["Sarah", "Mike", "Emma"],
          maxParticipants: 4,
          isPrivate: false,
          createdAt: new Date().toISOString(),
          status: "active",
          description: "Preparing for algorithms exam - sorting & searching",
          roomCode: "ALGO123"
        }
      ];
      setRooms(demoRooms);
      localStorage.setItem("studyforge_study_rooms", JSON.stringify(demoRooms));
    }
  }, []);

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createRoom = () => {
    if (!roomName.trim()) return;

    const newRoom: StudyRoom = {
      id: `room_${Date.now()}`,
      name: roomName,
      subject: roomSubject,
      color: getSubjectColor(roomSubject),
      host: "You",
      participants: ["You"],
      maxParticipants,
      isPrivate,
      createdAt: new Date().toISOString(),
      status: "active",
      description: roomDescription,
      roomCode: generateRoomCode()
    };

    const updatedRooms = [newRoom, ...rooms];
    setRooms(updatedRooms);
    localStorage.setItem("studyforge_study_rooms", JSON.stringify(updatedRooms));
    
    setShowCreateModal(false);
    setActiveRoom(newRoom);
    
    // Reset form
    setRoomName("");
    setRoomDescription("");
    setIsPrivate(false);
    setMaxParticipants(4);
  };

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      "Mathematics": "#EC4899",
      "Computer Science": "#8B5CF6",
      "Physics": "#3B82F6",
      "Chemistry": "#F59E0B",
      "Biology": "#10B981",
      "General Study": "#6366F1"
    };
    return colors[subject] || "#6366F1";
  };

  const joinRoom = (room: StudyRoom) => {
    if (room.participants.includes("You")) {
      setActiveRoom(room);
      return;
    }

    if (room.participants.length >= room.maxParticipants) {
      alert("Room is full!");
      return;
    }

    const updatedRoom = {
      ...room,
      participants: [...room.participants, "You"]
    };

    const updatedRooms = rooms.map(r => r.id === room.id ? updatedRoom : r);
    setRooms(updatedRooms);
    localStorage.setItem("studyforge_study_rooms", JSON.stringify(updatedRooms));
    setActiveRoom(updatedRoom);
  };

  const joinByCode = () => {
    const room = rooms.find(r => r.roomCode === joinCode.toUpperCase());
    if (room) {
      joinRoom(room);
      setJoinCode("");
    } else {
      alert("Invalid room code!");
    }
  };

  const copyRoomCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const leaveRoom = () => {
    if (!activeRoom) return;

    const updatedRoom = {
      ...activeRoom,
      participants: activeRoom.participants.filter(p => p !== "You")
    };

    const updatedRooms = rooms.map(r => r.id === activeRoom.id ? updatedRoom : r);
    setRooms(updatedRooms);
    localStorage.setItem("studyforge_study_rooms", JSON.stringify(updatedRooms));
    setActiveRoom(null);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      user: "You",
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages([...chatMessages, message]);
    setNewMessage("");
  };

  // Active Room View
  if (activeRoom) {
    return (
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        {/* Room Header */}
        <div className="h-16 glass border-b flex items-center justify-between px-6" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${activeRoom.color}15`, color: activeRoom.color }}>
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg" style={{ color: "var(--foreground)" }}>{activeRoom.name}</h2>
                <p className="text-xs" style={{ color: "var(--foreground-muted)" }}>
                  {activeRoom.participants.length}/{activeRoom.maxParticipants} participants
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => copyRoomCode(activeRoom.roomCode)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-[var(--surface-hover)] transition-colors text-sm font-medium border"
              style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{activeRoom.roomCode}</span>
            </button>
            <button
              onClick={leaveRoom}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors text-sm font-semibold border border-red-500/20"
            >
              <Phone className="w-4 h-4 rotate-135" /> Leave Room
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Video Grid */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="grid grid-cols-2 gap-4 h-full">
              {activeRoom.participants.map((participant, idx) => (
                <motion.div
                  key={participant}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative glass rounded-xl overflow-hidden border flex items-center justify-center"
                  style={{ borderColor: "var(--border)", minHeight: "300px" }}
                >
                  {/* Video Placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold" style={{ background: `${activeRoom.color}20`, color: activeRoom.color }}>
                        {participant.charAt(0).toUpperCase()}
                      </div>
                      <p className="font-semibold" style={{ color: "var(--foreground)" }}>{participant}</p>
                      <p className="text-xs mt-1" style={{ color: "var(--foreground-muted)" }}>
                        {participant === "You" ? (isVideoOn ? "Camera On" : "Camera Off") : "Connected"}
                      </p>
                    </div>
                  </div>

                  {/* Participant Name Badge */}
                  <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg glass backdrop-blur-md">
                    <span className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>{participant}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chat Sidebar */}
          <AnimatePresence>
            {isChatOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="border-l glass flex flex-col"
                style={{ borderColor: "var(--border)" }}
              >
                {/* Chat Header */}
                <div className="h-14 border-b px-4 flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>Chat</h3>
                  <button onClick={() => setIsChatOpen(false)} className="p-1 hover:bg-[var(--surface-hover)] rounded">
                    <X className="w-4 h-4" style={{ color: "var(--foreground-muted)" }} />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-auto p-4 space-y-3">
                  {chatMessages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" style={{ color: "var(--foreground-muted)" }} />
                      <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>No messages yet</p>
                    </div>
                  ) : (
                    chatMessages.map((msg, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold" style={{ color: activeRoom.color }}>{msg.user}</span>
                          <span className="text-[10px]" style={{ color: "var(--foreground-muted)" }}>{msg.time}</span>
                        </div>
                        <div className="px-3 py-2 rounded-lg glass text-sm" style={{ color: "var(--foreground)" }}>
                          {msg.message}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t" style={{ borderColor: "var(--border)" }}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 rounded-lg glass border focus:ring-2 focus:ring-indigo-500/20 focus:outline-none text-sm"
                      style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                    />
                    <button
                      onClick={sendMessage}
                      className="px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors text-sm font-semibold"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Control Bar */}
        <div className="h-20 glass border-t flex items-center justify-center gap-4" style={{ borderColor: "var(--border)" }}>
          <button
            onClick={() => setIsAudioOn(!isAudioOn)}
            className={`p-4 rounded-full transition-all ${isAudioOn ? "bg-[var(--surface-hover)]" : "bg-red-500"}`}
            title={isAudioOn ? "Mute" : "Unmute"}
          >
            {isAudioOn ? <Mic className="w-5 h-5" style={{ color: "var(--foreground)" }} /> : <MicOff className="w-5 h-5 text-white" />}
          </button>

          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-4 rounded-full transition-all ${isVideoOn ? "bg-[var(--surface-hover)]" : "bg-red-500"}`}
            title={isVideoOn ? "Stop Video" : "Start Video"}
          >
            {isVideoOn ? <Video className="w-5 h-5" style={{ color: "var(--foreground)" }} /> : <VideoOff className="w-5 h-5 text-white" />}
          </button>

          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="p-4 rounded-full bg-[var(--surface-hover)] hover:bg-indigo-500/20 transition-all relative"
            title="Toggle Chat"
          >
            <MessageSquare className="w-5 h-5" style={{ color: "var(--foreground)" }} />
            {chatMessages.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                {chatMessages.length}
              </span>
            )}
          </button>

          <button
            onClick={() => copyRoomCode(activeRoom.roomCode)}
            className="p-4 rounded-full bg-[var(--surface-hover)] hover:bg-emerald-500/20 transition-all"
            title="Share Room Code"
          >
            <Share2 className="w-5 h-5" style={{ color: "var(--foreground)" }} />
          </button>
        </div>
      </div>
    );
  }

  // Rooms List View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold" style={{ fontFamily: "var(--font-outfit)", color: "var(--foreground)" }}>
            Study Rooms
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--foreground-secondary)" }}>
            Connect with friends and study together in real-time
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 transition-opacity shadow-md"
        >
          <Plus className="w-4 h-4" /> Create Room
        </button>
      </div>

      {/* Join by Code */}
      <div className="glass rounded-xl p-6 border" style={{ borderColor: "var(--border)" }}>
        <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
          <UserPlus className="w-5 h-5 text-indigo-500" /> Join with Room Code
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="Enter room code (e.g., CALC2024)"
            className="flex-1 px-4 py-2.5 rounded-lg glass border focus:ring-2 focus:ring-indigo-500/20 focus:outline-none text-sm font-mono"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
            maxLength={8}
          />
          <button
            onClick={joinByCode}
            disabled={!joinCode}
            className="px-6 py-2.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
          >
            Join Room
          </button>
        </div>
      </div>

      {/* Active Rooms */}
      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--foreground)" }}>Active Study Rooms</h2>
        {rooms.filter(r => r.status === "active").length === 0 ? (
          <div className="text-center py-20 glass border rounded-2xl" style={{ borderColor: "var(--border)" }}>
            <Users className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: "var(--foreground-muted)" }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>No Active Rooms</h3>
            <p className="text-sm mb-6" style={{ color: "var(--foreground-secondary)" }}>
              Create a new study room to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.filter(r => r.status === "active").map((room) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-5 border card-lift flex flex-col"
                style={{ borderColor: "var(--border)" }}
              >
                {/* Room Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: `${room.color}15`, color: room.color }}>
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold leading-tight" style={{ color: "var(--foreground)" }}>{room.name}</h3>
                      <p className="text-xs" style={{ color: "var(--foreground-muted)" }}>{room.subject}</p>
                    </div>
                  </div>
                  {room.isPrivate ? (
                    <Lock className="w-4 h-4" style={{ color: "var(--foreground-muted)" }} />
                  ) : (
                    <Globe className="w-4 h-4" style={{ color: "var(--foreground-muted)" }} />
                  )}
                </div>

                {/* Description */}
                <p className="text-sm mb-4 flex-1" style={{ color: "var(--foreground-secondary)" }}>
                  {room.description}
                </p>

                {/* Room Info */}
                <div className="flex items-center justify-between text-xs mb-4 pb-4 border-b" style={{ borderColor: "var(--border)", color: "var(--foreground-muted)" }}>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {room.participants.length}/{room.maxParticipants}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Active
                  </span>
                </div>

                {/* Host & Join Button */}
                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    <span style={{ color: "var(--foreground-muted)" }}>Host: </span>
                    <span className="font-semibold" style={{ color: room.color }}>{room.host}</span>
                  </div>
                  <button
                    onClick={() => joinRoom(room)}
                    disabled={room.participants.length >= room.maxParticipants && !room.participants.includes("You")}
                    className="px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-semibold"
                  >
                    {room.participants.includes("You") ? "Rejoin" : "Join Room"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[999] flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-6 max-w-md w-full border"
              style={{ borderColor: "var(--border)" }}
            >
              <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>Create Study Room</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>Room Name</label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="e.g., Calculus Study Group"
                    className="w-full px-4 py-2.5 rounded-lg glass border focus:ring-2 focus:ring-indigo-500/20 focus:outline-none text-sm"
                    style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>Subject</label>
                  <select
                    value={roomSubject}
                    onChange={(e) => setRoomSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg glass border focus:ring-2 focus:ring-indigo-500/20 focus:outline-none text-sm"
                    style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    <option>General Study</option>
                    <option>Mathematics</option>
                    <option>Computer Science</option>
                    <option>Physics</option>
                    <option>Chemistry</option>
                    <option>Biology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>Description</label>
                  <textarea
                    value={roomDescription}
                    onChange={(e) => setRoomDescription(e.target.value)}
                    placeholder="What will you study together?"
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg glass border focus:ring-2 focus:ring-indigo-500/20 focus:outline-none text-sm resize-none"
                    style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>Max Participants</label>
                  <input
                    type="number"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
                    min={2}
                    max={10}
                    className="w-full px-4 py-2.5 rounded-lg glass border focus:ring-2 focus:ring-indigo-500/20 focus:outline-none text-sm"
                    style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="private"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <label htmlFor="private" className="text-sm" style={{ color: "var(--foreground)" }}>
                    Make room private (requires code to join)
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg glass hover:bg-[var(--surface-hover)] transition-colors text-sm font-semibold border"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={createRoom}
                  disabled={!roomName.trim()}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity text-sm font-semibold"
                >
                  Create Room
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Made with Bob
