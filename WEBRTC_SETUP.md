# WebRTC Real-Time Video/Audio Setup Guide

## Overview
StudyForge now includes real peer-to-peer video and audio connections using WebRTC technology. This enables true collaborative study sessions with live video and audio streaming.

## Architecture

### Components
1. **WebRTC (Simple-Peer)** - Peer-to-peer connections
2. **Socket.IO** - Signaling server for connection establishment
3. **Custom Next.js Server** - Handles Socket.IO alongside Next.js
4. **React Hook (useWebRTC)** - Manages WebRTC state and connections

### How It Works
```
User A                    Signaling Server              User B
  |                              |                         |
  |------ join-room ------------>|                         |
  |                              |<------ join-room -------|
  |                              |                         |
  |<----- room-users ------------|                         |
  |                              |------ user-joined ----->|
  |                              |                         |
  |------ WebRTC offer --------->|                         |
  |                              |------ signal ---------->|
  |                              |                         |
  |                              |<------ signal ----------|
  |<----- WebRTC answer ---------|                         |
  |                              |                         |
  |<========== P2P Connection Established ================>|
  |                   (Direct Audio/Video Stream)          |
```

## Files Created

### 1. WebRTC Hook
**File**: `src/hooks/useWebRTC.ts`
- Manages peer connections
- Handles media streams (audio/video)
- Provides controls (mute/unmute, video on/off)
- Automatic cleanup on disconnect

### 2. Socket.IO Server
**File**: `server.js`
- Custom Next.js server with Socket.IO
- Handles signaling for WebRTC
- Room management
- User presence tracking

### 3. Socket.IO API Route
**File**: `src/app/api/socket/route.ts`
- Alternative Socket.IO initialization
- Can be used for serverless deployments

## Usage in Study Rooms

### Basic Implementation

```typescript
import { useWebRTC } from '@/hooks/useWebRTC';

function StudyRoom({ roomId, userId, userName }) {
  const {
    peers,
    localStream,
    isAudioEnabled,
    isVideoEnabled,
    toggleAudio,
    toggleVideo,
  } = useWebRTC({ roomId, userId, userName });

  return (
    <div>
      {/* Local video */}
      <video
        ref={(video) => {
          if (video && localStream) {
            video.srcObject = localStream;
          }
        }}
        autoPlay
        muted
        playsInline
      />

      {/* Remote videos */}
      {peers.map((peer) => (
        <video
          key={peer.peerId}
          ref={(video) => {
            if (video && peer.stream) {
              video.srcObject = peer.stream;
            }
          }}
          autoPlay
          playsInline
        />
      ))}

      {/* Controls */}
      <button onClick={toggleAudio}>
        {isAudioEnabled ? 'Mute' : 'Unmute'}
      </button>
      <button onClick={toggleVideo}>
        {isVideoEnabled ? 'Stop Video' : 'Start Video'}
      </button>
    </div>
  );
}
```

## Running the Server

### Development
```bash
npm run dev
```

This now starts the custom server with Socket.IO support.

### Production
```bash
npm run build
npm start
```

## Browser Permissions

Users will be prompted for:
- **Camera access** - For video streaming
- **Microphone access** - For audio streaming

Handle permission denials gracefully:
```typescript
try {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
} catch (error) {
  // Fallback to audio-only or show error message
  console.error('Media access denied:', error);
}
```

## STUN/TURN Servers

### Current Configuration
Uses Google's public STUN servers:
```javascript
{
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ]
}
```

### For Production (Recommended)
Use TURN servers for better connectivity:

#### Option 1: Twilio TURN
```javascript
{
  iceServers: [
    {
      urls: 'turn:global.turn.twilio.com:3478?transport=udp',
      username: 'your-twilio-username',
      credential: 'your-twilio-credential',
    },
  ]
}
```

#### Option 2: Xirsys
```javascript
{
  iceServers: [
    {
      urls: 'turn:your-server.xirsys.com:80?transport=udp',
      username: 'your-username',
      credential: 'your-credential',
    },
  ]
}
```

#### Option 3: Self-Hosted (coturn)
```javascript
{
  iceServers: [
    {
      urls: 'turn:your-server.com:3478',
      username: 'your-username',
      credential: 'your-credential',
    },
  ]
}
```

## Deployment

### Vercel Deployment

**Important**: Vercel's serverless functions don't support WebSocket connections. For WebRTC to work on Vercel, you need:

#### Option 1: Separate Signaling Server
1. Deploy signaling server to a platform that supports WebSockets:
   - **Railway** (recommended)
   - **Render**
   - **Heroku**
   - **DigitalOcean**

2. Update Socket.IO client connection:
```typescript
const socket = io('https://your-signaling-server.railway.app', {
  path: '/socket.io',
});
```

#### Option 2: Use Managed Service
- **Agora** - Full WebRTC solution
- **Twilio Video** - Enterprise-grade
- **Daily.co** - Easy integration
- **100ms** - Developer-friendly

### Railway Deployment (Signaling Server)

1. Create `railway.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

2. Deploy:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

## Security Considerations

### 1. Secure Signaling
- Use HTTPS in production
- Implement authentication for Socket.IO
- Validate room access

### 2. Media Encryption
- WebRTC uses DTLS-SRTP for encryption
- All media is encrypted by default

### 3. Rate Limiting
- Limit room creation
- Limit concurrent connections
- Monitor bandwidth usage

## Troubleshooting

### No Video/Audio
1. Check browser permissions
2. Verify HTTPS (required for getUserMedia)
3. Check firewall settings
4. Test STUN/TURN connectivity

### Connection Fails
1. Check Socket.IO connection
2. Verify signaling server is running
3. Test with TURN server
4. Check NAT/firewall configuration

### Poor Quality
1. Reduce video resolution
2. Adjust bitrate
3. Use TURN server
4. Check network bandwidth

## Testing

### Local Testing
```bash
# Terminal 1
npm run dev

# Open multiple browser windows
# Navigate to study room
# Test video/audio connections
```

### Network Testing
```bash
# Test STUN server
npm install -g stun

# Check connectivity
stun stun.l.google.com 19302
```

## Performance Optimization

### 1. Video Quality
```typescript
const stream = await navigator.mediaDevices.getUserMedia({
  video: {
    width: { ideal: 640 },  // Lower for better performance
    height: { ideal: 480 },
    frameRate: { ideal: 24 }, // Lower FPS
  },
  audio: true,
});
```

### 2. Bandwidth Management
- Implement adaptive bitrate
- Monitor connection quality
- Fallback to audio-only

### 3. Connection Pooling
- Limit max participants per room
- Use SFU for larger groups (>4 people)

## Alternative Solutions

### For Large-Scale Deployments

#### 1. Agora.io
```bash
npm install agora-rtc-sdk-ng
```

#### 2. Twilio Video
```bash
npm install twilio-video
```

#### 3. Daily.co
```bash
npm install @daily-co/daily-js
```

## Monitoring

### Metrics to Track
- Connection success rate
- Average connection time
- Video/audio quality
- Bandwidth usage
- Error rates

### Tools
- WebRTC Stats API
- Socket.IO admin UI
- Custom analytics

## Support

For issues:
- Check browser console for errors
- Verify Socket.IO connection
- Test with different browsers
- Check network configuration

## Resources

- [WebRTC Documentation](https://webrtc.org/)
- [Simple-Peer GitHub](https://github.com/feross/simple-peer)
- [Socket.IO Documentation](https://socket.io/docs/)
- [MDN WebRTC Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)