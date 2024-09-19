'use client';
import { styled } from 'styled-components';

export const Div = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const Word = styled.span`
  white-space: nowrap;
  position: relative;
`;

export const Span = styled.span<{ isActive: boolean }>`  // Accept isActive prop
  position: relative;
  display: inline-block;
  white-space: nowrap;
  color: ${({ isActive }) => (isActive ? 'var(--active-link-color)' : 'var(--link-color)')}; // Dynamic color
  font-size: 1rem;
  font-weight: 400;
  transition: color 0.3s ease; // Smooth color transition for active state

  @media (max-width: 768px) {
    color: ${({ isActive }) => (isActive ? 'var(--active-background)' : 'var(--background)')}; // Adjust for mobile
    font-size: 1.5rem;
    font-weight: 500;
  }
`;

export const AbsoluteContainer = styled.div`
  position: absolute;
  top: 0;
`;
