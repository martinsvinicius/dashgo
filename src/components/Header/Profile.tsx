import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import { useAuth } from '../../auth/hooks/useAuth';

interface ProfileProps {
  showProfileData: boolean;
}

export function Profile({ showProfileData }: ProfileProps) {
  const { user } = useAuth();

  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>{user?.name}</Text>
          <Text color="gray.300" fontSize="small">
            {user?.email}
          </Text>
        </Box>
      )}

      <Avatar
        size="md"
        name={user?.name}
      />
    </Flex>
  );
}
