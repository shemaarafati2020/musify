import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  Search,
  UserPlus,
  Ban,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { api } from '../../services/api';
import type { MockSystemUser } from '../../data/mockData';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  padding: 32px;
  max-width: 1400px;
  animation: ${fadeIn} 0.4s ease;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;

  h1 {
    color: #fff;
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 6px 0;
  }

  p {
    color: #9ca3af;
    font-size: 14px;
    margin: 0;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
  }
`;

const Toolbar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const SearchBar = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;

  input {
    width: 100%;
    padding: 10px 16px 10px 40px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    color: #fff;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: #7c3aed;
    }

    &::placeholder {
      color: #6b7280;
    }
  }

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: #9ca3af;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: rgba(255, 255, 255, 0.15);
    color: #fff;
  }
`;

const StatsRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const MiniStat = styled.div<{ $color: string }>`
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.$color};
  }

  .label {
    color: #9ca3af;
    font-size: 12px;
  }

  .value {
    color: #fff;
    font-size: 18px;
    font-weight: 700;
    margin-left: auto;
  }
`;

const Table = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 200px 100px 100px 120px 80px;
  padding: 14px 20px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  span {
    color: #6b7280;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 200px 100px 100px 120px 80px;
  padding: 14px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  align-items: center;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const UserCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
  }

  .info {
    .name {
      color: #fff;
      font-size: 14px;
      font-weight: 500;
    }
    .email {
      color: #6b7280;
      font-size: 12px;
    }
  }
`;

const RoleBadge = styled.span<{ $role: string }>`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;

  ${props => {
    switch (props.$role) {
      case 'admin':
        return 'background: rgba(139, 92, 246, 0.15); color: #a78bfa;';
      case 'user':
        return 'background: rgba(6, 182, 212, 0.15); color: #67e8f9;';
      case 'guest':
        return 'background: rgba(156, 163, 175, 0.15); color: #9ca3af;';
      default:
        return '';
    }
  }}
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 500;

  ${props => {
    switch (props.$status) {
      case 'active':
        return 'color: #34d399;';
      case 'suspended':
        return 'color: #f87171;';
      case 'inactive':
        return 'color: #6b7280;';
      default:
        return '';
    }
  }}
`;

const CellText = styled.span`
  color: #9ca3af;
  font-size: 13px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 4px;
`;

const ActionBtn = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
  }

  &.danger:hover {
    color: #f87171;
    background: rgba(248, 113, 113, 0.1);
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);

  .info {
    color: #6b7280;
    font-size: 13px;
  }

  .pages {
    display: flex;
    gap: 4px;
  }
`;

const PageButton = styled.button<{ $active?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: ${props =>
    props.$active ? '#7c3aed' : 'rgba(255,255,255,0.04)'};
  color: ${props => (props.$active ? '#fff' : '#9ca3af')};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${props =>
      props.$active ? '#7c3aed' : 'rgba(255,255,255,0.08)'};
  }
`;

const LoadingWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #b3b3b3;

  svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

interface ApiUser {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  avatar?: string | null;
  createdAt: string;
}

function mapUser(u: ApiUser): MockSystemUser {
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    role: (u.role?.toLowerCase() || 'user') as 'admin' | 'user' | 'guest',
    status: (u.status?.toLowerCase() || 'active') as 'active' | 'suspended' | 'inactive',
    joinDate: u.createdAt ? new Date(u.createdAt).toISOString().slice(0, 10) : '',
    lastActive: '',
    playlists: 0,
    streams: 0,
    avatar: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`,
  };
}

export default function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<MockSystemUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await api.get<{ users: ApiUser[] }>('/api/users?limit=50');
        setUsers((data.users || []).map(mapUser));
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    u =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = users.filter(u => u.status === 'active').length;
  const suspendedCount = users.filter(u => u.status === 'suspended').length;
  const inactiveCount = users.filter(u => u.status === 'inactive').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={12} />;
      case 'suspended':
        return <Ban size={12} />;
      case 'inactive':
        return <Clock size={12} />;
      default:
        return null;
    }
  };

  return (
    <Container>
      <Header>
        <div>
          <h1>Users Management</h1>
          <p>Manage all registered users, roles, and permissions</p>
        </div>
        <AddButton>
          <UserPlus size={16} />
          Add User
        </AddButton>
      </Header>

      <StatsRow>
        <MiniStat $color="#34d399">
          <div className="dot" />
          <span className="label">Active</span>
          <span className="value">{activeCount}</span>
        </MiniStat>
        <MiniStat $color="#f87171">
          <div className="dot" />
          <span className="label">Suspended</span>
          <span className="value">{suspendedCount}</span>
        </MiniStat>
        <MiniStat $color="#6b7280">
          <div className="dot" />
          <span className="label">Inactive</span>
          <span className="value">{inactiveCount}</span>
        </MiniStat>
        <MiniStat $color="#a78bfa">
          <div className="dot" />
          <span className="label">Total</span>
          <span className="value">{users.length}</span>
        </MiniStat>
      </StatsRow>

      <Toolbar>
        <SearchBar>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </SearchBar>
        <FilterButton>
          <Filter size={14} />
          Filter
        </FilterButton>
        <FilterButton>
          <Download size={14} />
          Export
        </FilterButton>
      </Toolbar>

      {loading ? (
        <LoadingWrap><Loader2 size={32} /></LoadingWrap>
      ) : (
      <Table>
        <TableHeader>
          <span>User</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
          <span>Streams</span>
          <span>Actions</span>
        </TableHeader>

        {filteredUsers.map(user => (
          <TableRow key={user.id}>
            <UserCell>
              <img src={user.avatar} alt={user.username} />
              <div className="info">
                <div className="name">{user.username}</div>
                <div className="email">Joined {user.joinDate}</div>
              </div>
            </UserCell>
            <CellText>{user.email}</CellText>
            <div>
              <RoleBadge $role={user.role}>{user.role}</RoleBadge>
            </div>
            <StatusBadge $status={user.status}>
              {getStatusIcon(user.status)}
              {user.status}
            </StatusBadge>
            <CellText>{user.streams.toLocaleString()}</CellText>
            <ActionButtons>
              <ActionBtn title="Edit">
                <Edit size={14} />
              </ActionBtn>
              <ActionBtn className="danger" title="Delete">
                <Trash2 size={14} />
              </ActionBtn>
            </ActionButtons>
          </TableRow>
        ))}

        <Pagination>
          <span className="info">
            Showing {filteredUsers.length} of {users.length} users
          </span>
          <div className="pages">
            <PageButton>
              <ChevronLeft size={14} />
            </PageButton>
            <PageButton $active>1</PageButton>
            <PageButton>2</PageButton>
            <PageButton>
              <ChevronRight size={14} />
            </PageButton>
          </div>
        </Pagination>
      </Table>
      )}
    </Container>
  );
}
