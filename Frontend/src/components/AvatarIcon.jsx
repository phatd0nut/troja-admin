import React from "react";
import { Avatar, Badge, styled } from "../utils/MaterialUI";
import logo from "../assets/img/logos/iftroja-ljungby.png";

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 3s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(4)',
      opacity: 0,
    },
  },
}));

const AvatarIcon = ({ username }) => {  
  return (
    <StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
    >
  <Avatar
      alt={username}
      src={logo}
      sx={{ width: 56, height: 56 }}
    />
    </StyledBadge>
  );
};

export default AvatarIcon;