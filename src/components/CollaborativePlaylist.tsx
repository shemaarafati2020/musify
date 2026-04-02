import { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  Send,
  Lock,
  Unlock,
  X,
  MessageSquare,
  Heart,
  MoreHorizontal,
  Clock,
} from 'lucide-react';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Content = styled(motion.div)`
  background: var(--bg-elevated);
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 24px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const PlaylistCover = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
`;

const PlaylistDetails = styled.div`
  flex: 1;
`;

const PlaylistTitle = styled.h2`
  margin: 0 0 8px 0;
  color: var(--text-primary);
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PlaylistMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  color: var(--text-secondary);
  font-size: 14px;
`;

const Collaborators = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Avatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid var(--bg-elevated);
  margin-left: -8px;

  &:first-child {
    margin-left: 0;
  }
`;

const AddCollaboratorBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--accent);
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -8px;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 300px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
`;

const SidebarSection = styled.div`
  padding: 16px;
  border-bottom: 1px solid var(--border);

  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h3`
  margin: 0 0 12px 0;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TrackList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const TrackItem = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;

  &:hover {
    background: var(--bg-secondary);
  }
`;

const TrackNumber = styled.span`
  color: var(--text-tertiary);
  font-size: 14px;
  width: 30px;
  text-align: center;
`;

const TrackInfo = styled.div`
  flex: 1;
  margin-left: 12px;
  min-width: 0;
`;

const TrackName = styled.div`
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackArtist = styled.div`
  color: var(--text-secondary);
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;

  ${TrackItem}:hover & {
    opacity: 1;
  }
`;

const AddedBy = styled.div`
  color: var(--text-tertiary);
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Message = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
  flex-direction: row;
`;

const MessageAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

const MessageContent = styled.div`
  max-width: 70%;
  background: var(--bg-secondary);
  padding: 8px 12px;
  border-radius: 12px;
  color: var(--text-primary);
`;

const MessageAuthor = styled.div`
  font-size: 11px;
  color: var(--text-tertiary);
  margin-bottom: 4px;
`;

const MessageText = styled.div`
  font-size: 14px;
  line-height: 1.4;
`;

const MessageTime = styled.div`
  font-size: 10px;
  color: var(--text-tertiary);
  margin-top: 4px;
`;

const ChatInput = styled.div`
  padding: 16px;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 8px;
`;

const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 8px;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 100;
`;

const SearchResultItem = styled.div`
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: var(--bg-secondary);
  }
`;

interface PlaylistTrack {
  id: string;
  name: string;
  artist: string;
}

interface CollaborativePlaylistProps {
  isOpen: boolean;
  onClose: () => void;
  playlist: {
    id: string;
    name: string;
    tracks: PlaylistTrack[];
  };
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: Date;
}

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  role: 'owner' | 'editor' | 'viewer';
}

export function CollaborativePlaylist({
  isOpen,
  onClose,
  playlist,
}: CollaborativePlaylistProps) {
  const [collaborators] = useState<Collaborator[]>([
    {
      id: '1',
      name: 'John Doe',
      avatar: 'https://picsum.photos/seed/user1/64/64',
      role: 'owner',
    },
    {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://picsum.photos/seed/user2/64/64',
      role: 'editor',
    },
    {
      id: '3',
      name: 'Bob Johnson',
      avatar: 'https://picsum.photos/seed/user3/64/64',
      role: 'viewer',
    },
  ]);

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: '1',
      userId: '2',
      userName: 'Jane Smith',
      userAvatar: 'https://picsum.photos/seed/user2/64/64',
      text: 'Love this playlist! Added some new tracks 🎵',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: '2',
      userId: '3',
      userName: 'Bob Johnson',
      userAvatar: 'https://picsum.photos/seed/user3/64/64',
      text: 'Great vibes! Perfect for the weekend',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      userId: '1',
      userName: 'John Doe',
      userAvatar: 'https://picsum.photos/seed/user1/64/64',
      text: newMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleAddTrack = (track: PlaylistTrack) => {
    // Add track to playlist logic here
    console.log('Adding track:', track);
    setShowSearch(false);
    setSearchQuery('');
  };

  const mockSearchResults = [
    {
      id: '1',
      title: 'Summer Breeze',
      artist: 'The Beach Boys',
      albumArt: 'https://picsum.photos/seed/search1/64/64',
    },
    {
      id: '2',
      title: 'Good Vibrations',
      artist: 'The Beach Boys',
      albumArt: 'https://picsum.photos/seed/search2/64/64',
    },
  ];

  if (!isOpen) return null;

  return (
    <Container onClick={onClose}>
      <Content
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={e => e.stopPropagation()}
      >
        <Header>
          <HeaderInfo>
            <PlaylistCover
              src={
                playlist.coverImage ||
                'https://picsum.photos/seed/playlist/160/160'
              }
            />
            <PlaylistDetails>
              <PlaylistTitle>
                <Users size={20} />
                {playlist.name}
              </PlaylistTitle>
              <PlaylistMeta>
                <span>{playlist.tracks.length} tracks</span>
                <span>•</span>
                <span>{collaborators.length} collaborators</span>
                <span>•</span>
                <button
                  onClick={() => setIsPublic(!isPublic)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {isPublic ? <Unlock size={14} /> : <Lock size={14} />}
                  {isPublic ? 'Public' : 'Private'}
                </button>
              </PlaylistMeta>
            </PlaylistDetails>
          </HeaderInfo>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
              }}
            >
              <Share size={20} />
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </Header>

        <Body>
          <Sidebar>
            <SidebarSection>
              <SectionTitle>
                <Users size={16} />
                Collaborators
              </SectionTitle>
              <Collaborators>
                {collaborators.map(collaborator => (
                  <Avatar
                    key={collaborator.id}
                    src={collaborator.avatar}
                    alt={collaborator.name}
                    title={`${collaborator.name} (${collaborator.role})`}
                  />
                ))}
                <AddCollaboratorBtn title="Add collaborator">
                  <UserPlus size={16} />
                </AddCollaboratorBtn>
              </Collaborators>
            </SidebarSection>

            <SidebarSection style={{ flex: 1, overflow: 'hidden' }}>
              <SectionTitle>
                <MessageSquare size={16} />
                Chat
              </SectionTitle>
              <ChatContainer>
                <Messages>
                  {messages.map(message => (
                    <Message key={message.id}>
                      <MessageAvatar src={message.userAvatar} />
                      <MessageContent>
                        <MessageAuthor>{message.userName}</MessageAuthor>
                        <MessageText>{message.text}</MessageText>
                        <MessageTime>
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </MessageTime>
                      </MessageContent>
                    </Message>
                  ))}
                  <div ref={messagesEndRef} />
                </Messages>
                <ChatInput>
                  <input
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    style={{
                      background: 'var(--accent)',
                      border: 'none',
                      color: '#fff',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    <Send size={16} />
                  </button>
                </ChatInput>
              </ChatContainer>
            </SidebarSection>
          </Sidebar>

          <TrackList>
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearch(true)}
                placeholder="Search for tracks..."
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                }}
              />
              <AnimatePresence>
                {showSearch && searchQuery && (
                  <SearchResults>
                    {mockSearchResults.map(result => (
                      <SearchResultItem
                        key={result.id}
                        onClick={() =>
                          handleAddTrack({
                            id: result.id,
                            name: result.title,
                            artist: result.artist,
                            album: '',
                            duration: 0,
                            imageUrl: result.albumArt,
                          })
                        }
                      >
                        <img
                          src={result.albumArt}
                          alt={result.title}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '4px',
                          }}
                        />
                        <div>
                          <div
                            style={{
                              color: 'var(--text-primary)',
                              fontSize: '14px',
                            }}
                          >
                            {result.title}
                          </div>
                          <div
                            style={{
                              color: 'var(--text-secondary)',
                              fontSize: '12px',
                            }}
                          >
                            {result.artist}
                          </div>
                        </div>
                      </SearchResultItem>
                    ))}
                  </SearchResults>
                )}
              </AnimatePresence>
            </div>

            {playlist.tracks.map((track: PlaylistTrack, index: number) => {
              const trackId = typeof track === 'string' ? track : track.id;
              return (
                <TrackItem
                  key={trackId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TrackNumber>{index + 1}</TrackNumber>
                  <TrackInfo>
                    <TrackName>Sample Track</TrackName>
                    <TrackArtist>Sample Artist</TrackArtist>
                    <AddedBy>
                      <Clock size={10} />
                      Added by John
                    </AddedBy>
                  </TrackInfo>
                  <TrackActions>
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                      }}
                    >
                      <Heart size={16} />
                    </button>
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                      }}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </TrackActions>
                </TrackItem>
              );
            })}
          </TrackList>
        </Body>
      </Content>
    </Container>
  );
}
