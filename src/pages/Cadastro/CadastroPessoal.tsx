import { useForm, Controller } from "react-hook-form";
import { Button, Label, Fieldset, Input, Form, Titulo, ErrorMessage } from "../../components";
import InputMask from "../../components/InputMask";
import { useEffect } from "react";

interface FormInputTipos {
    nome: string;
    email: string;
    telefone: string;
    senha: string;
    senhaVerificada: string;
}

const CadastroPessoal = () => {
    const {
        register, 
        handleSubmit, 
        formState: { errors, isSubmitSuccessful },
        watch,
        control,
        reset,
    } = useForm<FormInputTipos>({
      mode: 'all',
      defaultValues: {
        nome: "",
        email: "",
        telefone: "",
        senha: "",
        senhaVerificada: "",
      }
    });

    useEffect(() => {
      reset();
    }, [isSubmitSuccessful]);

    const senha = watch("senha");

    const validaSenha = {
        obrigatorio: (val: string) => !!val || "Por favor, insira a senha novamente.",
        tamanhoMinimo: (val: string) => val.length >= 6 || "A senha deve ter pelo menos 6 caracteres",
        senhaIguais: (val: string) => val === senha || "As duas senhas deve ser iguais.",
    }

    const aoSubmeter = (dados: FormInputTipos) => {
        console.log(dados);
    }

    function validarEmail(valor: string){
        const formatoEmail = /^[^\s@]+@alura\.com\.br$/;
        if(!formatoEmail.test(valor)){
            console.log('Este email é invalido.');
            return false;
        }
        return true;
    }

    return (
    <>
      <Titulo>Insira alguns dados básicos:</Titulo>
      <Form onSubmit={handleSubmit(aoSubmeter)}>
        <Fieldset>
          <Label htmlFor="campo-nome">Nome</Label>
          <Input
            id="campo-nome"
            placeholder="Digite seu nome completo"
            type="text"
            $error={!!errors.nome}
            {...register("nome", {
                required: "Campo de nome é obrigatório", 
                minLength: {
                    value: 5,
                    message: 'o nome deve ter no mínimo 5 carateres'
                }
            })}
          />
          {errors.nome && <ErrorMessage>{errors.nome.message}</ErrorMessage>}
        </Fieldset>
        <Fieldset>
          <Label htmlFor="campo-email">E-mail</Label>
          <Input
            id="campo-email"
            placeholder="Insira seu endereço de email"
            type="email"
            $error={!!errors.email}
            {...register("email", {required: 'O campo de email é obrigatório.', validate: validarEmail })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </Fieldset>
        
        <Controller 
          control={control} 
          name="telefone" 
          rules={{ pattern: {
              value: /^\(\d{2,3}\) \d{5}-\d{4}$/,
              message: 'O telefone está inserido no formato incorreto'
            }, 
            required: 'O campo telefone é obrigatório.'
          }}
          render={({field}) => (
            <Fieldset>
              <Label>Telefone</Label>
              <InputMask 
                mask="(99) 99999-9999" 
                placeholder="Ex: (DDD) XXXXX-XXXX" 
                $error={!!errors.telefone}
                onChange={field.onChange}
              />
              {errors.telefone && <ErrorMessage>{errors.telefone.message}</ErrorMessage>}
            </Fieldset>
          )}
        />

        <Fieldset>
          <Label htmlFor="campo-senha">Crie uma senha</Label>
          <Input
            id="campo-senha"
            placeholder="Crie uma senha"
            type="password"
            $error={!!errors.senha}
            {...register("senha", {
                required: 'O campo senha é obrigatório',
                minLength: {
                    value: 6,
                    message: 'A senha deve ter pelo menos 6 caracteres'
                }
            })}
          />
          {errors.senha && <ErrorMessage>{errors.senha.message}</ErrorMessage>}
        </Fieldset>
        <Fieldset>
          <Label htmlFor="campo-senha-confirmacao">Repita a senha</Label>
          <Input
            id="campo-senha-confirmacao"
            placeholder="Repita a senha anterior"
            type="password"
            {...register("senhaVerificada", {
                required: 'Repita a senha.',
                validate: validaSenha
                }
            )}
          />
          {errors.senhaVerificada && <ErrorMessage>{errors.senhaVerificada.message}</ErrorMessage>}
        </Fieldset>
        <Button type="submit">Avançar</Button>
      </Form>
    </>
  );
};

export default CadastroPessoal;
