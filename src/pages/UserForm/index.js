import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';

import api from '../../services/api';

import { Form, Button, Input, Span } from './styles'; 

const tech = [
    { value: 1, label: 'ReactJs' },
    { value: 2, label: 'NodeJs' },
    { value: 3, label: 'React Native' },
]

const customStyles = {
    container: () => ({
      width: `${614}px`,
      backgroundColor: '#fff',
      borderRadius: `${5}px`
    })
  }


const UserForm = ({ handleSubmit, errors, handleChange, values, setFieldValue }) => (
    <Form onSubmit={handleSubmit}>
        <Input placeholder="nome" type="text" name="name" value={values.nome} onChange={handleChange}/>
        { !!errors.name && <Span>{errors.name}</Span>  }
        <Input placeholder="email" type="email" name="email" value={values.email} onChange={handleChange}/>
        { !!errors.email && <Span>{errors.email}</Span>  }
        <Input placeholder="senha" type="password" name="password" value={values.password} onChange={handleChange}/>
        { !!errors.password && <Span>{errors.password}</Span>  }
        <Input placeholder="confirmação de senha" type="password" name="password_confirmation" value={values.password_confirmation} onChange={handleChange}/>
        { !!errors.password_confirmation && <Span>{errors.password_confirmation}</Span>  }

        <Select 
            placeholder="Tecnologias"
            options={tech}
            isMulti
            onChange={value => setFieldValue('tech', value)}
            value={values.tech}
            styles={customStyles}
        />
        <Button type="submit">Enviar</Button>
    </Form>
);

export default withFormik({

    mapPropsToValues: () => ({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    }),

    validateOnChange: false,
    validateOnBlur: false,

    validationSchema: Yup.object().shape({
        name: Yup.string().required('Campo obrigatório'),
        email: Yup.string().email('E-mail inválido').required('Campo obrigatório'),
        password: Yup.string().required('Campo obrigatório'),
        password_confirmation: Yup.string().oneOf([
            Yup.ref('password'),
            null,
        ], 'As senhas não batem').required('Campo obrigatório')
    }),

    handleSubmit: (values, { props }) => {
        const id = props.match.params.id;

        const data = {
            ...values,
            tech: values.tech.map(t => t.value),
        }        

        api.postOrPut('users', id, data);
    },
})(UserForm);
