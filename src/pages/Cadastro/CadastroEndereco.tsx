import { Controller, useForm } from "react-hook-form";
import {
  Button,
  ErrorMessage,
  Fieldset,
  Form,
  FormContainer,
  Input,
  Label,
  Titulo,
} from "../../components";
import InputMask from "../../components/InputMask";

interface FormInputEndereco {
  cep: string
  rua: string
  numero: string
  bairro: string
  localidade: string
}

const CadastroEndereco = () => {
  const {
    register, 
    handleSubmit, 
    setError, 
    setValue, 
    watch, 
    control,
    formState: {errors}
  } = useForm<FormInputEndereco>({
    mode: 'all',
    defaultValues: {
      cep: '',
      rua: '',
      bairro: '',
      numero: '',
      localidade: '',
    }
  });

  const aoSubmeter = (dados: FormInputEndereco) => {
    console.log(dados)
  }

  const cepDigitado = watch('cep');

  const fetchEndereco = async (cep: string) => {
    if(!cep) {
      setError('cep', {
        type: "manual",
        message: "Cep inválido."
      });
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json`);
      const data = await response.json();

      if(response.ok){
        setValue('rua', data.logradouro);
        setValue('localidade', `${data.localidade}, ${data.uf}`);
        setValue('bairro', data.bairro);

      }else{
        throw new Error("Cep inválido.");
      }

    }catch(error){
      console.log(error);
    }
  }

  return (
    <>
      <Titulo>Agora, mais alguns dados sobre você:</Titulo>
      <Form onSubmit={handleSubmit(aoSubmeter)}>

      <Controller
        control={control}
        name="cep"
        rules={{
          required: "O campo de cep é obrigatório",
        }}
        render={({ field }) => (
          <Fieldset>
            <Label>CEP</Label>
            <InputMask
              mask="99999-999"
              id="campo-cep"
              placeholder="Insira seu CEP"
              type="text"
              $error={!!errors.cep}
              onChange={field.onChange}
              onBlur={() => fetchEndereco(cepDigitado)}
            />
            {errors.cep && <ErrorMessage>{errors.cep.message}</ErrorMessage>}
          </Fieldset>
        )}
      />

        <Fieldset>
          <Label htmlFor="campo-rua">Rua</Label>
          <Input 
            id="campo-rua" 
            placeholder="Rua Agarikov" 
            type="text" 
            {...register('rua', {required: 'O campo é obrigatório.'})} 
            $error={!!errors.rua}
          />
          {errors.rua && <ErrorMessage>{errors.rua.message}</ErrorMessage>}
        </Fieldset>

        <FormContainer>
          <Fieldset>
            <Label htmlFor="campo-numero-rua">Número</Label>
            <Input 
              id="campo-numero-rua" 
              placeholder="Ex: 1440" 
              type="text" 
              {...register('numero', {required: 'O campo é obrigatório.'})} 
              $error={!!errors.numero}
            />
            {errors.numero && <ErrorMessage>{errors.numero.message}</ErrorMessage>}
          </Fieldset>
          <Fieldset>
            <Label htmlFor="campo-bairro">Bairro</Label>
            <Input 
              id="campo-bairro" 
              placeholder="Vila Mariana" 
              type="text" 
              {...register('bairro', {required: 'O campo é obrigatório.'})} 
              $error={!!errors.bairro}
            />
            {errors.bairro && <ErrorMessage>{errors.bairro.message}</ErrorMessage>}
          </Fieldset>
        </FormContainer>

        <Fieldset>
          <Label htmlFor="campo-localidade">Localidade</Label>
          <Input
            id="campo-localidade"
            placeholder="São Paulo, SP"
            type="text"
            {...register('localidade', {required: 'O campo é obrigatório.'})} 
            $error={!!errors.localidade}
          />
          {errors.localidade && <ErrorMessage>{errors.localidade.message}</ErrorMessage>}
        </Fieldset>
        <Button type="submit">Cadastrar</Button>
      </Form>
    </>
  );
};

export default CadastroEndereco;
