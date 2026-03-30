import { NavLink, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Activity,
  Settings,
  Music,
  Crown,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ProtectedRoute } from '../../components/ProtectedRoute';

const LayoutContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  background: #0a0a0a;
`;

const AdminSidebar = styled.nav`
  width: 260px;
  background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const AdminHeader = styled.div`
  padding: 0 20px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 12px;

  .admin-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .admin-text {
    h3 {
      color: #fff;
      font-size: 16px;
      font-weight: 700;
      margin: 0;
    }
    p {
      color: #a78bfa;
      font-size: 12px;
      margin: 0;
    }
  }
`;

const NavSection = styled.div`
  margin-bottom: 24px;
`;

const NavSectionTitle = styled.div`
  color: #6b7280;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  padding: 0 20px;
  margin-bottom: 8px;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  color: #9ca3af;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  position: relative;

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.04);
  }

  &.active {
    color: #a855f7;
    background: rgba(168, 85, 247, 0.08);

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 24px;
      background: #a855f7;
      border-radius: 0 3px 3px 0;
    }
  }

  .chevron {
    margin-left: auto;
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover .chevron,
  &.active .chevron {
    opacity: 1;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  background: #0a0a0a;
`;

function AdminLayoutContent() {
  const { user } = useAuth();

  return (
    <LayoutContainer>
      <AdminSidebar>
        <AdminHeader>
          <div className="admin-icon">
            <Crown size={20} color="#fff" />
          </div>
          <div className="admin-text">
            <h3>Admin Panel</h3>
            <p>{user?.username}</p>
          </div>
        </AdminHeader>

        <NavSection>
          <NavSectionTitle>Overview</NavSectionTitle>
          <NavItem to="/admin" end>
            <LayoutDashboard />
            <span>Dashboard</span>
            <ChevronRight size={14} className="chevron" />
          </NavItem>
          <NavItem to="/admin/analytics">
            <BarChart3 />
            <span>Analytics</span>
            <ChevronRight size={14} className="chevron" />
          </NavItem>
          <NavItem to="/admin/performance">
            <Activity />
            <span>Performance</span>
            <ChevronRight size={14} className="chevron" />
          </NavItem>
        </NavSection>

        <NavSection>
          <NavSectionTitle>Management</NavSectionTitle>
          <NavItem to="/admin/users">
            <Users />
            <span>Users</span>
            <ChevronRight size={14} className="chevron" />
          </NavItem>
          <NavItem to="/admin/settings">
            <Settings />
            <span>System Settings</span>
            <ChevronRight size={14} className="chevron" />
          </NavItem>
        </NavSection>

        <NavSection>
          <NavSectionTitle>Entertainment</NavSectionTitle>
          <NavItem to="/admin/music">
            <Music />
            <span>My Music</span>
            <ChevronRight size={14} className="chevron" />
          </NavItem>
        </NavSection>
      </AdminSidebar>

      <ContentArea>
        <Outlet />
      </ContentArea>
    </LayoutContainer>
  );
}

export default function AdminLayout() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayoutContent />
    </ProtectedRoute>
  );
}
