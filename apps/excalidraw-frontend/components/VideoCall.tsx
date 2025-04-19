import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar, AvatarFallback } from './ui/avatar';

interface VideoCallProps {
  socket: WebSocket;
  roomId: string;
  userId: string;
  users: { id: string; name: string | null }[];
}

export function VideoCall({ socket, roomId, userId, users }: VideoCallProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [incomingCall, setIncomingCall] = useState<{ fromUserId: string; fromUserName: string | null } | null>(null);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string | null } | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [showCallDialog, setShowCallDialog] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  console.log("users in video call", incomingCall);
  const admin = users.find(user => user.id === userId);
  
  // Initialize WebRTC when component mounts
  useEffect(() => {
    // Listen for incoming call signals
    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'video-call') {
        const { callType, callData, fromUserId } = data;
        
        // Find the caller's name
        const caller = users.find(user => user.id === fromUserId);
        
        if (callType === 'offer' && !isCallActive) {
          // Incoming call
          setIncomingCall({
            fromUserId,
            fromUserName: caller?.name || 'Unknown User'
          });
          setShowCallDialog(true);
          
          // Don't set remote description here - we'll do it when accepting the call
          // Store the offer data for later use
          sessionStorage.setItem('pendingOffer', JSON.stringify(callData));
        } 
        else if (callType === 'answer' && isCallActive) {
          // Call was accepted
          try {
            const answerDesc = new RTCSessionDescription(callData);
            peerConnectionRef.current?.setRemoteDescription(answerDesc)
              .catch(err => console.error('Error setting remote answer:', err));
          } catch (err) {
            console.error('Error processing answer:', err);
          }
        }
        else if (callType === 'ice-candidate' && (isCallActive || incomingCall)) {
          // Add ICE candidate
          try {
            const candidate = new RTCIceCandidate(callData);
            peerConnectionRef.current?.addIceCandidate(candidate)
              .catch(err => console.error('Error adding ICE candidate:', err));
          } catch (err) {
            console.error('Error processing ICE candidate:', err);
          }
        }
        else if (callType === 'hang-up') {
          // Other user hung up
          endCall();
        }
      }
    };

    socket.addEventListener('message', handleMessage);
    
    return () => {
      socket.removeEventListener('message', handleMessage);
      // Clean up any active call when component unmounts
      if (isCallActive) {
        endCall();
      }
    };
  }, [socket, isCallActive, incomingCall, users]);

  // Accept an incoming call
  const acceptCall = async () => {
    if (!incomingCall) return;
    
    const peerConnection = await setupPeerConnection();
    if (!peerConnection) return;
    
    try {
      // Get the stored offer and set it as remote description first
      const storedOffer = sessionStorage.getItem('pendingOffer');
      if (!storedOffer) {
        console.error('No pending offer found');
        return;
      }
      
      const offerDesc = new RTCSessionDescription(JSON.parse(storedOffer));
      await peerConnection.setRemoteDescription(offerDesc);
      
      // Now create an answer
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      
      // Send the answer to the caller
      socket.send(JSON.stringify({
        type: 'video-call',
        callType: 'answer',
        callData: answer,
        targetUserId: incomingCall.fromUserId,
        roomId
      }));
      
      setIsCallActive(true);
      // Clear the stored offer
      sessionStorage.removeItem('pendingOffer');
    } catch (err) {
      console.error('Error creating answer:', err);
    }
  };
  
  // Set up the peer connection
  const setupPeerConnection = async () => {
    // Create a new RTCPeerConnection
    const configuration = { 
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ] 
    };
    
    const peerConnection = new RTCPeerConnection(configuration);
    peerConnectionRef.current = peerConnection;
    
    // Get local media stream
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: isVideoEnabled,
        audio: isAudioEnabled
      });
      
      localStreamRef.current = stream;
      
      // Display local video
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Add tracks to the peer connection
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });
      
      // Handle incoming tracks (remote video)
      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
      
      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          // Send the ICE candidate to the other peer
          const targetUserId = selectedUser?.id || incomingCall?.fromUserId;
          
          if (targetUserId) {
            socket.send(JSON.stringify({
              type: 'video-call',
              callType: 'ice-candidate',
              callData: event.candidate,
              targetUserId,
              roomId
            }));
          }
        }
      };
      
      return peerConnection;
    } catch (err) {
      console.error('Error accessing media devices:', err);
      return null;
    }
  };
  
  // Initiate a call to another user
  const startCall = async (user: { id: string; name: string | null }) => {
    setSelectedUser(user);
    setShowCallDialog(true);
    
    const peerConnection = await setupPeerConnection();
    if (!peerConnection) return;
    
    try {
      // Create an offer
      const offer = await peerConnection.createOffer();
      console.log("offer", offer);
      await peerConnection.setLocalDescription(offer);
      
      // Send the offer to the other user
      console.log("sending offer");
      socket.send(JSON.stringify({
        type: 'video-call',
        callType: 'offer',
        callData: offer,
        targetUserId: user.id,
        roomId
      }));
      
      setIsCallActive(true);
    } catch (err) {
      console.error('Error creating offer:', err);
    }
  };
  
  // Reject an incoming call
  const rejectCall = () => {
    if (!incomingCall) return;
    
    socket.send(JSON.stringify({
      type: 'video-call',
      callType: 'hang-up',
      targetUserId: incomingCall.fromUserId,
      roomId
    }));
    
    setIncomingCall(null);
    setShowCallDialog(false);
  };
  
  // End an active call
  const endCall = () => {
    // Stop all tracks in the local stream
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    
    // Close the peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    // Reset video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    
    // Notify the other user
    const targetUserId = selectedUser?.id || incomingCall?.fromUserId;
    console.log("IncomingCall", incomingCall);
    console.log("targetUserId", targetUserId);
    if (targetUserId) {
      socket.send(JSON.stringify({
        type: 'video-call',
        callType: 'hang-up',
        targetUserId,
        roomId
      }));
    }
    
    // Reset state
    setIsCallActive(false);
    setSelectedUser(null);
    setIncomingCall(null);
    setShowCallDialog(false);
  };
  
  // Toggle video
  const toggleVideo = async () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };
  
  // Toggle audio
  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };
  
  // Render the component
  return (
    <>
      {/* Call Dialog */}
      <Dialog open={showCallDialog} onOpenChange={setShowCallDialog}>
        <DialogContent className="sm:max-w-md [&>button]:hidden" onInteractOutside={(e)=> e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>
              {isCallActive 
                ? `Call with ${selectedUser?.name || incomingCall?.fromUserName || 'User'}`
                : incomingCall 
                  ? `Incoming call from ${incomingCall.fromUserName}`
                  : `Calling ${selectedUser?.name}`
              }
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="relative bg-muted rounded-lg overflow-hidden">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 text-xs bg-background/80 px-2 py-1 rounded">
                You
              </div>
            </div>
            
            <div className="relative bg-muted rounded-lg overflow-hidden">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 text-xs bg-background/80 px-2 py-1 rounded">
                {selectedUser?.name || incomingCall?.fromUserName || 'User'}
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-4 mt-4">
            {isCallActive ? (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleVideo}
                >
                  {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleAudio}
                >
                  {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={endCall}
                >
                  <PhoneOff className="h-4 w-4" />
                </Button>
              </>
            ) : incomingCall ? (
              <>
                <Button
                  variant="default"
                  onClick={acceptCall}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Accept
                </Button>
                
                <Button
                  variant="destructive"
                  onClick={rejectCall}
                >
                  <PhoneOff className="h-4 w-4 mr-2" />
                  Decline
                </Button>
              </>
            ) : (
              <Button
                variant="destructive"
                onClick={() => setShowCallDialog(false)}
              >
                Cancel
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* User list with call buttons */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
        <div className="flex items-center justify-between bg-background/80 backdrop-blur-sm p-2 rounded-md">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>{admin?.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{admin?.name || 'Anonymous'}(You)</span>
                </div>

              </div>
          {users
            .filter(user => user.id !== userId) // Don't show current user
            .map(user => (
              <div key={user.id} className="flex items-center justify-between bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{user.name || 'Anonymous'}</span>
                  <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => startCall(user)}
                  disabled={isCallActive || !!incomingCall}
                >
                  <Phone className="h-3 w-3 text-green-500" />
                </Button>
                </div>
              </div>
            ))}
      </div>
    </>
  );
}