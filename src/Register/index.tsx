import React from "react";
import { useState} from "react";
import { 
    Modal, 
    TouchableWithoutFeedback, 
    Keyboard,
    Alert,
} from 'react-native';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useForm } from "react-hook-form";
import { InputForm } from "../components/Forms/InputForm";
import { Button } from "../components/Forms/Button";
import { TransactionTypeButton } from "../components/Forms/TransactionTypeButton";
import { CategorySelectButton } from "../components/Forms/CategorySelectButton";
import uuid from 'react-native-uuid';
import { CategorySelect } from "../screens/CategorySelect";
import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes
} from './styles';
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../hooks/auth";


export interface FormData {
    name: string,
    amount: string,
}

const schema = Yup.object().shape({
    name: Yup
        .string()
        .required('Nome é onrigatório'),
    amount: Yup
    .number()
    .typeError('Informe um valor numerico')
    .positive('O valor não pode ser negativo')
    .required('O valor é obrigatório')  //aos 11:44 nao tinha esse required
});



export function Register () {
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    const { user } = useAuth();

    const dataKey = '@gofinances:transactions';

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria'
      });

    const navigation = useNavigation();

    const {
        control,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm({
        resolver: yupResolver(schema)
    });

   
    function handleTransactionTypeSelect(type: 'positive' | 'negative' ) {
        setTransactionType(type);
    }

    function handleOpenSelectCategoryModal() {
        setCategoryModalOpen(true);
    }

    function handleCloseSelectCategoryModal() {
        setCategoryModalOpen(false);
    }

   async function handleRegister(form: FormData){
       if(!transactionType)
            return Alert.alert("Selecione o tipo da transação.");
        
        if (category.key ==='category')
        return Alert.alert("Selecione uma categoria.");


     const newTransaction = {
        id: String(uuid.v4()),
        name: form.name, 
        amount: form.amount,
        type: transactionType,
        category: category.key,
        date: new Date()
       }    
        
       try {
           const datakey = `@gofinances:transactions_user:${user.id}`;
           const data = await AsyncStorage.getItem(dataKey); // inicialmente era dataKey
           const currentData = data ? JSON.parse(data) : [];
           
           const dataFormatted = [
               ...currentData,
               newTransaction
           ];
           
           await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

           reset();
           setTransactionType('');
           setCategory({
               key:'category',
               name: 'Categoria'
           }); 
           navigation.navigate('Listagem'); // la dentro de routes>api.routes.tsx colocamos um name para rota chamado Listagem. aqui so copiamos


            } catch (error) {
                console.log(error);
                Alert.alert("Não foi possível salvar");
            }
        }

      

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
            
            <Header>
                <Title>Cadastro</Title>
            </Header>

            <Form>
                <Fields>
                <InputForm
                name="name"
                control={control} 
                placeholder="Nome"
                autoCapitalize="sentences"
                autoCorrect={false}
                error={errors.name && errors.name.message}              
                />

                <InputForm
                name="amount"
                control={control} 
                placeholder="Preço"
                keyboardType="numeric"
                error={errors.amount && errors.amount.message}              
                />

                <TransactionsTypes>
                <TransactionTypeButton 
                    type="up"
                    title="Income"
                    onPress={() => handleTransactionTypeSelect('positive')}
                    isActive={transactionType ==='positive'}
                />
                <TransactionTypeButton 
                    type="down"
                    title="Outcome"
                    onPress={() => handleTransactionTypeSelect('negative')}
                    isActive={transactionType ==='negative'}
                />
                </TransactionsTypes>

                <CategorySelectButton 
                title={category.name} 
                onPress={handleOpenSelectCategoryModal}
                />
                </Fields>

            <Button 
            title="Enviar"  
            onPress={handleSubmit(handleRegister)}
            />

            </Form>
            <Modal visible={categoryModalOpen}>
                <CategorySelect 
                    category={category}
                    setCategory={setCategory}
                    closeSelectCategory={handleCloseSelectCategoryModal}
                
                />
            </Modal>
        </Container>
        </TouchableWithoutFeedback>

    );
}








//================================================


/*
import React from "react";
import { useState, useEffect} from "react";
import { 
    Modal, 
    TouchableWithoutFeedback, 
    Keyboard,
    Alert,
} from 'react-native';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from "react-hook-form";
import { InputForm } from "../components/Forms/InputForm";
import { Button } from "../components/Forms/Button";
import { TransactionTypeButton } from "../components/Forms/TransactionTypeButton";
import { CategorySelectButton } from "../components/Forms/CategorySelectButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CategorySelect } from "../screens/CategorySelect";
import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes
} from './styles';



export interface FormData {
    name: string,
    amount: string,
}

const schema = Yup.object().shape({
    name: Yup
        .string()
        .required('Nome é onrigatório'),
    amount: Yup
    .number()
    .typeError('Informe um valor numerico')
    .positive('O valor não pode ser negativo')
    .required('O valor é obrigatório')
})



export async function Register () {

   const dataKey = "@gofinances:transactions";

    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria'
        
    });

    const {
        control,
        handleSubmit,
        formState: {errors}
    } = useForm({
        resolver: yupResolver(schema)
    });

   
    function handleTransactionTypeSelect(type: 'up' | 'down' ) {
        setTransactionType(type);
    }

    function handleOpenSelectCategoryModal() {
        setCategoryModalOpen(true);
    }

    function handleCloseSelectCategoryModal() {
        setCategoryModalOpen(false);
    }

   async function handleRegister(form: FormData){
       if(!transactionType)
            return Alert.alert("Selecione o tipo da transação.");
        
        if (category.key ==='category')
        return Alert.alert("Selecione uma categoria.");
   

        const newTransaction  = {
            name: form.name, 
            amount: form.amount,
           transactionType,
            category: category.key}

       try {
        const data = await AsyncStorage.getItem(dataKey);
        const currentData = data ? JSON.parse(data) : [];

        const dataFormatted = {
            ...currentData,
            newTransaction
        }

        await AsyncStorage.setItem(dataKey, JSON.stringify(data));
        

    } catch (error) {
     console.log(error);
     Alert.alert("Não foi possível salvar");
 }

 useEffect(() => {
     async function loadData(){
      const dataX = await AsyncStorage.getItem(dataKey);
      console.log(JSON.parse(dataX!));
     }
     loadData();

 }, []);
    
    

}
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
            
            <Header>
                <Title>Cadastro</Title>
            </Header>

            <Form>
                <Fields>
                <InputForm
                name="name"
                control={control} 
                placeholder="Nome"
                autoCapitalize="sentences"
                autoCorrect={false}
                error={errors.name && errors.name.message}              
                />

                <InputForm
                name="amount"
                control={control} 
                placeholder="Preço"
                keyboardType="numeric"
                error={errors.amount && errors.amount.message}              
                />

                <TransactionsTypes>
                <TransactionTypeButton 
                    type="up"
                    title="Income"
                    onPress={() => handleTransactionTypeSelect('up')}
                    isActive={transactionType ==='up'}
                />
                <TransactionTypeButton 
                    type="down"
                    title="Outcome"
                    onPress={() => handleTransactionTypeSelect('down')}
                    isActive={transactionType ==='down'}
                />
                </TransactionsTypes>
                <CategorySelectButton 
                title={category.name} 
                onPress={handleOpenSelectCategoryModal}
                />
                </Fields>

            <Button 
            title="Enviar"  
            onPress={handleSubmit(handleRegister)}
            />

            </Form>
            <Modal visible={categoryModalOpen}>
                <CategorySelect 
                    category={category}
                    setCategory={setCategory}
                    closeSelectCategory={handleCloseSelectCategoryModal}
                
                />
            </Modal>
        </Container>
        </TouchableWithoutFeedback>

    );
}
*/