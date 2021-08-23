import { Avatar, Box, Flex, Text } from '@chakra-ui/react';

interface ProfileProps {
  showProfileData: boolean;
}

export function Profile({ showProfileData }: ProfileProps) {
  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>Vinicius Martins</Text>
          <Text color="gray.300" fontSize="small">
            vinicius.victor.sm@gmail.com
          </Text>
        </Box>
      )}

      <Avatar
        size="md"
        name="Vinicius Martins"
        src="https://github.com/martinsvinicius.png"
      />
    </Flex>
  );
}
