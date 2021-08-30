import {
  Avatar,
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { useAuth } from '../../auth/hooks/useAuth';

interface ProfileProps {
  showProfileData: boolean;
}

export function Profile({ showProfileData }: ProfileProps) {
  const { user, signOut } = useAuth();

  function handleSignOut() {
    signOut();
  }

  return (
    <Flex align="center">
      <Menu>
        <MenuButton>
          <Avatar size="md" name={user?.name} />
        </MenuButton>

        <MenuList fontSize="lg" bgColor="gray.900" borderColor="transparent">
          <MenuItem
            icon={<RiLogoutBoxRLine />}
            _hover={{ bgColor: 'transparent', color: 'pink.400' }}
            _focus={{ bgColor: 'transparent' }}
            onClick={handleSignOut}
          >
            Sair
          </MenuItem>
        </MenuList>
      </Menu>

      {showProfileData && (
        <Box ml="4" textAlign="left">
          <Text>{user?.name}</Text>
          <Text color="gray.300" fontSize="small">
            {user?.email}
          </Text>
        </Box>
      )}
    </Flex>
  );
}
