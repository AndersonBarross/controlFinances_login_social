import React from "react";
import { date } from "yup/lib/locale";
import { categories } from "../utils/categories";
import { Container } from "./styles";
import {
    Title,
    Amount,
    Footer,
    Category,
    Icon,
    CategoryName,
    Date,
} from './styles';


export interface TransactionCardProps {
    type: 'positive' | 'negative';
    name: string;   // antes chamado de title. nos mudamos para name
    amount: string;
    category: string,
    date: string;
}

export interface Props {
    data: TransactionCardProps;
}

export function TransactionCard({ data } : Props) {
    const category = categories.filter( // vou fazer um filter para percorrer todos os itens e encontrar o item que será igual a minha key.category
        item => item.key === data.category
    )[ 0 ];  // peguei a primeira posição da listagem
    return (
        <Container>
            <Title>{data.name}</Title>

            <Amount type={data.type}>
                {data.type === 'negative' && '- '}
                {data.amount}
                </Amount>

            <Footer>
                <Category>
                    <Icon name={category.icon} />
                    <CategoryName>{category.name}</CategoryName>
                </Category>
                <Date>{data.date}</Date>
            </Footer>
        </Container>
    )
}