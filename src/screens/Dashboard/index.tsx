import React from "react";
import { useCallback, useEffect, useState } from "react";
import { HighLightCard } from "../../components/HighLightCard";
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard";
//import { Title } from "../../components/HighLightCard/styles";
import {
    Container, Header, User, UserInfo, Photo,
    UserGretting, UserName, UserWrapper, Icon, HighlightCards,
    Transactions, Title, TransactionList, LogoutButton, LoadContainer
} from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import { useTheme } from "styled-components";
import { useAuth } from "../../hooks/auth";






export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighlightProps {
    amount: string;
    lastTransaction: string;
};

interface HighlightData {
    entries: HighlightProps;
    expensives: HighlightProps;
    total: HighlightProps;
};

export function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

    const theme = useTheme();
    const {signOut, user} = useAuth();


    function getLastTransactionDate(
        collection: DataListProps[],
        type: 'positive' | 'negative'
        ) {

        const collectionFiltered = collection
        .filter(transaction => transaction.type === type);

        if(collectionFiltered.length === 0) {
            return 0
        }

        const lastTransaction = new Date(
            Math.max.apply(Math, collectionFiltered
                .map(transaction => new Date(transaction.date).getTime()))
                );
            return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })} de ${lastTransaction.getFullYear()}`;

    };

    async function loadTransactions() {
        const dataKey = `@gofinances:transactions_user:${user.id}`;  // puxei as transações e coloquei no dataKey
        const response = await AsyncStorage.getItem(dataKey); // peguei elas e salvei no response
        const transactions = response ? JSON.parse(response) : []; // transformei em JSON e coloquei no transactions
        // a ideia é aproveitar o map para verificar quem sao os positives e os negatives e ir somando
        let entriesTotal = 0; // usei let para poder trocar os valores da variavel
        let expensiveTotal = 0;

        const transactionsFormatted: DataListProps[] = transactions
            .map((item: DataListProps) => {

                // alem de tudo vou fazer: se o item for positive, eu vou incrementar e pegar o item.amount e ja fazer a soma.

                if (item.type === 'positive') {
                    entriesTotal += Number(item.amount);
                } else {
                    expensiveTotal += Number(item.amount);
                }

                const amount = Number(item.amount)
                    .toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    });


                const date = Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                }).format(new Date(item.date));

                return {
                    id: item.id,
                    name: item.name,
                    amount: amount,
                    type: item.type,
                    category: item.category,
                    date,
                }

            });

        setTransactions(transactionsFormatted);

        // console.log(lastTransactionEntries); para ver a data em formato timestamp
        // console.log(new Date(lastTransactionEntries)); para ver a data em formato Date

        const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
        const lastTransactionExpenses = getLastTransactionDate(transactions, 'negative');
       
        const totalInterval = lastTransactionExpenses === 0 
        ? "Não há transações cadastradas, por favor cadastre uma transação" 
        :`01 a ${lastTransactionExpenses}`;

        // vamos dar um console.log para ver se esta funcionando
        console.log

        const total = entriesTotal - expensiveTotal;

        setHighlightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastTransactionEntries === 0 
                ? "Sem transações, por favor cadastre uma transação" 
                : `Última entrada dia ${lastTransactionEntries}`,
            },
            expensives: {
                amount: expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastTransactionExpenses === 0 
                ? "Sem transações, por favor cadastre uma transação"
                : `Última saída dia ${lastTransactionExpenses}`,
            },

            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                
                }),
                lastTransaction: totalInterval
            }
        });

       // console.log(transactionsFormatted) caso eu queira ver os dados que estão sendo enviados.
        setIsLoading(false);

    }

    useEffect(() => {
        loadTransactions();

        // agora para limpar a lista basta colocar essas duas linhas abaixo
       // const dataKey = '@gofinances:transactions';  
        // AsyncStorage.removeItem(dataKey);// depois, salva, pois roda(RR) e comenta ou retirar essas duas.

    }, []);

    useFocusEffect(useCallback(() => {
        loadTransactions();
    }, []));

    return (
        <Container>
            
                {
                    isLoading ? 
                        <LoadContainer>
                            <ActivityIndicator 
                                color={theme.colors.primary}
                                size="large"
                                />
                            </LoadContainer> :
                <>
                    <Header>
                        <UserWrapper>
                            <UserInfo>
                                <Photo
                                    //source={{ uri: 'https://avatars.githubusercontent.com/u/95106150?v=4' }} 
                                    source={{ uri: user.photo }} 
                                
                                />
                                <User>
                                    <UserGretting> olá</UserGretting>
                                    <UserName>{user.name}</UserName>
                                </User>

                            </UserInfo>

                            <LogoutButton onPress={signOut} >
                                <Icon name="power" />
                            </LogoutButton>
                        </UserWrapper>
                    </Header>
                    <HighlightCards >
                        <HighLightCard
                            type="up"
                            title="Entradas"
                            amount={highlightData.entries.amount}
                            lastTransaction={highlightData.entries.lastTransaction}
                        />
                        <HighLightCard
                            type="down"
                            title="Saídas"
                            amount={highlightData.expensives.amount}
                            lastTransaction={highlightData.expensives.lastTransaction}
                        />
                        <HighLightCard
                            type="total"
                            title="Total"
                            amount={highlightData.total.amount}
                            lastTransaction={highlightData.total.lastTransaction}
                        />

                    </HighlightCards>

                    <Transactions>
                        <Title>Listagem</Title>

                        <TransactionList
                            data ={transactions}
                            //data = {data}
                            keyExtractor={(item: { id: string; }) => item.id}
                            renderItem={({ item }) => <TransactionCard data={item} />}

                        />

                    </Transactions>
                </>
            }

        </Container>

    )
}

