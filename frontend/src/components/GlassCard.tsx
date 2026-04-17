import styled from 'styled-components';
import { motion } from 'framer-motion';
import { darkGlassmorphism } from '../styles/animations';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  blur?: string;
  opacity?: number;
  hover?: boolean;
  animation?: 'fadeIn' | 'scaleIn' | 'none';
  delay?: number;
}

const GlassCardContainer = styled(motion.div)<{
  $blur: string;
  $opacity: number;
  $hover: boolean;
}>`
  ${darkGlassmorphism('10px', 0.7)}
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    background: rgba(0, 0, 0, 0.8);
  }
`;

export function GlassCard({ 
  children, 
  className, 
  blur = '10px', 
  opacity = 0.7, 
  hover = true,
  animation = 'fadeIn',
  delay = 0
}: GlassCardProps) {
  const getAnimation = () => {
    switch (animation) {
      case 'scaleIn':
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.3, delay },
        };
      case 'fadeIn':
      default:
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3, delay },
        };
    }
  };

  return (
    <GlassCardContainer
      className={className}
      $blur={blur}
      $opacity={opacity}
      $hover={hover}
      {...getAnimation()}
    >
      {children}
    </GlassCardContainer>
  );
}

// Glass morphism button
interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const GlassButtonContainer = styled(motion.button)<{
  $variant: 'primary' | 'secondary' | 'ghost';
  $size: 'sm' | 'md' | 'lg';
}>`
  ${() => darkGlassmorphism('10px', 0.3)}
  border-radius: 12px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${props => {
    switch (props.$size) {
      case 'sm':
        return `
          padding: 8px 16px;
          font-size: 14px;
        `;
      case 'lg':
        return `
          padding: 16px 32px;
          font-size: 18px;
        `;
      case 'md':
      default:
        return `
          padding: 12px 24px;
          font-size: 16px;
        `;
    }
  }}

  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: rgba(29, 185, 84, 0.2);
          border-color: rgba(29, 185, 84, 0.5);
          
          &:hover:not(:disabled) {
            background: rgba(29, 185, 84, 0.3);
            border-color: rgba(29, 185, 84, 0.8);
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(29, 185, 84, 0.3);
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          border-color: transparent;
          
          &:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
          }
        `;
      case 'secondary':
      default:
        return `
          &:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
          }
        `;
    }
  }}

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

export function GlassButton({
  children,
  onClick,
  variant = 'secondary',
  size = 'md',
  disabled = false,
  loading = false,
  className,
}: GlassButtonProps) {
  return (
    <GlassButtonContainer
      className={className}
      $variant={variant}
      $size={size}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {loading ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LoadingSpinner size="sm" />
          Loading...
        </span>
      ) : (
        children
      )}
    </GlassButtonContainer>
  );
}

// Loading spinner component
const SpinnerContainer = styled.div<{ $size: 'sm' | 'md' | 'lg' }>`
  display: inline-block;
  
  ${props => {
    switch (props.$size) {
      case 'sm':
        return 'width: 16px; height: 16px;';
      case 'lg':
        return 'width: 32px; height: 32px;';
      case 'md':
      default:
        return 'width: 24px; height: 24px;';
    }
  }}
`;

const SpinnerCircle = styled.div`
  width: 100%;
  height: 100%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <SpinnerContainer className={className} $size={size}>
      <SpinnerCircle />
    </SpinnerContainer>
  );
}

// Glass input field
interface GlassInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

const GlassInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const GlassInputLabel = styled.label`
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
`;

const GlassInputField = styled.input<{ $hasError: boolean }>`
  ${darkGlassmorphism('10px', 0.3)}
  border: 1px solid ${props => props.$hasError ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  padding: 12px 16px;
  color: #fff;
  font-size: 16px;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.05);

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? 'rgba(255, 0, 0, 0.8)' : 'rgba(29, 185, 84, 0.5)'};
    background: rgba(255, 255, 255, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const GlassInputError = styled.span`
  color: rgba(255, 0, 0, 0.8);
  font-size: 12px;
`;

export function GlassInput({
  type = 'text',
  placeholder,
  value,
  onChange,
  label,
  error,
  disabled = false,
  className,
}: GlassInputProps) {
  return (
    <GlassInputContainer className={className}>
      {label && <GlassInputLabel>{label}</GlassInputLabel>}
      <GlassInputField
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        $hasError={!!error}
        disabled={disabled}
      />
      {error && <GlassInputError>{error}</GlassInputError>}
    </GlassInputContainer>
  );
}
