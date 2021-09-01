import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Icon,
  Link,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useToast,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useState } from 'react';
import { RiAddLine, RiPencilLine } from 'react-icons/ri';

//components
import { Header } from '../../components/Header';
import Pagination from '../../components/Pagination';
import { Sidebar } from '../../components/Sidebar';
import { usePermission } from '../../hooks/usePermission';
import { useFetchUser } from '../../services/hooks/users/useFetchUser';
import { useUsers } from '../../services/hooks/users/useUsers';

export default function UserList() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isFetching, error } = useUsers(currentPage);
  const toast = useToast();

  const userHasPermissionToCreateUsers = usePermission({
    permissions: ['users.create'],
  });

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  // //data prefetch example
  // async function handlePrefetchUser(userId: number) {
  //   const user = await useFetchUser(userId);

  //   console.log(user.name + ' fetched');
  // }

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px={['4', '6']}>
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Usuários
              {isFetching && !isLoading && (
                <Spinner color="gray.500" ml="4" size="sm" />
              )}
            </Heading>

            {userHasPermissionToCreateUsers && (
              <NextLink href="/users/create" passHref>
                <Button
                  as="a"
                  size="sm"
                  fontSize="sm"
                  cursor="pointer"
                  colorScheme="pink"
                  leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                >
                  Criar novo
                </Button>
              </NextLink>
            )}
          </Flex>

          {isLoading ? (
            <Flex justify="center">
              <Spinner />
            </Flex>
          ) : error ? (
            <Flex justify="center">
              <Text>Falha ao obter dados dos usuários.</Text>
            </Flex>
          ) : (
            <>
              <Table colorScheme="whiteAlpha">
                <Thead>
                  <Tr>
                    <Th px={['4', '4', '6']} color="gray.300" width="8">
                      <Checkbox colorScheme="pink" />
                    </Th>
                    <Th>Usuário</Th>
                    {isWideVersion && <Th>Data de cadastro</Th>}
                    {isWideVersion && <Th width="8">Opções</Th>}
                  </Tr>
                </Thead>

                <Tbody>
                  {data.users.map((user) => (
                    <Tr key={user.email}>
                      <Td px={['4', '4', '6']}>
                        <Checkbox colorScheme="pink" />
                      </Td>
                      <Td>
                        <Box>
                          {/* <Link color="purple.400" onMouseEnter={() => handlePrefetchUser(user.id)}>
                            <Text fontWeight="bold">{user.name}</Text>
                          </Link> */}
                          <Text fontWeight="bold">{user.name}</Text>
                          <Text fontSize="sm" color="gray.300">
                            {user.email}
                          </Text>
                        </Box>
                      </Td>
                      {isWideVersion && <Td>{user.createdAt}</Td>}
                      {isWideVersion && (
                        <Td>
                          <Button
                            as="a"
                            size="sm"
                            onClick={() => {toast({
                              description: 'Recurso ainda não disponível',
                              status: 'info',
                              position: 'top-right',
                              duration: 3000,
                              isClosable: true
                            })}}
                            fontSize="sm"
                            cursor="pointer"
                            colorScheme="purple"
                            leftIcon={
                              <Icon
                                mr={isWideVersion ? 0 : -2}
                                as={RiPencilLine}
                                fontSize="18"
                              />
                            }
                          >
                            Editar
                          </Button>
                        </Td>
                      )}
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <Pagination
                totalCountOfRegisters={data.totalCount}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
