import { Button, Flex, Stack, useToast } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Input } from '../components/Form/Input';
import { useAuth } from '../auth/hooks/useAuth';
import { withSSRGuest } from '../utils/WithSSRGuest';
import { AxiosError } from 'axios';

type SignInFormData = {
  email: string;
  password: string;
};

const signInFormSchema = Yup.object().shape({
  email: Yup.string().required('E-mail é obrigatório').email('E-mail inválido'),
  password: Yup.string().required('Senha é obrigatória'),
});

export default function Home() {
  const { signIn, isAuthenticated } = useAuth();
  const toast = useToast();

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema),
  });

  const handleSignIn: SubmitHandler<SignInFormData> = async (data) => {
    signIn({ email: data.email, password: data.password }).catch(
      (error: AxiosError) => {
        if (error.response.status === 401) {
          toast({
            description: 'E-mail ou senha incorretos.',
            duration: 3000,
            status: 'warning',
            position: 'top-right',
          });
        } else {
          toast({
            description: 'Ocorreu um erro no servidor, tente novamente.',
            duration: 3000,
            status: 'error',
            position: 'top-right',
          });
        }
      }
    );
  };

  const { errors } = formState;

  return (
    <Flex w="100vw" h="100vh" align="center" justify="center">
      <Flex
        as="form"
        width="100%"
        maxWidth={360}
        bg="gray.800"
        p="8"
        borderRadius={8}
        flexDir="column"
        onSubmit={handleSubmit(handleSignIn)}
      >
        <Stack spacing="4">
          <Input
            name="email"
            type="email"
            label="E-mail"
            error={errors.email}
            {...register('email')}
          />
          <Input
            name="password"
            type="password"
            label="Senha"
            error={errors.password}
            {...register('password')}
          />
        </Stack>

        <Button
          type="submit"
          mt="6"
          colorScheme="pink"
          size="lg"
          isLoading={formState.isSubmitting}
        >
          Entrar
        </Button>
      </Flex>
    </Flex>
  );
}

export const getServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});
