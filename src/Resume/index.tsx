import React from "react";
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HistoryCard } from "../components/HistoryCard";
import { VictoryPie } from "victory-native";
import { useTheme } from "styled-components";
import { addMonths, subMonths, format } from "date-fns";
import {ptBR} from 'date-fns/locale';
import { ActivityIndicator } from "react-native";


import {
    Container, Header, Title, Content,ChartContainer,MonthSelect,MonthSelectButton,MonthSelectIcon,Month,LoadContainer,
} from './styles';
import { categories } from "../components/utils/categories";
import { ScrollView } from "react-native-gesture-handler";
import { Category } from "../components/TransactionCard/styles";
import { RFValue } from "react-native-responsive-fontsize";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../hooks/auth";

interface TransactionData {
    type: 'positive' | 'negative';
    name: string;   // antes chamado de title. nos mudamos para name
    amount: string;
    category: string,
    date: string;
    percent: string
}

interface CategoryData {
    key: string;
    name: string;
    total: number;
    color: string;
    totalFormatted: string;
    


}

export function Resume () {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]> ([]);

    const { user } = useAuth();
    
    
    
    const theme = useTheme();

    function handleDateChange(action: 'next' | 'prev') {
        if(action === 'next') {
            setSelectedDate(addMonths(selectedDate, 1));
        }else{
            setSelectedDate(subMonths(selectedDate, 1));    }
}

    async function loadData() {
        setIsLoading(true);
        const dataKey = `@gofinances:transactions_user:${user.id}`;
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        //para verificar se funcionou a chamada da storage, faz um console log
        //  console.log(responseFormatted);

        const expensives = responseFormatted
        .filter((expensive :TransactionData ) => 
        expensive.type === 'negative' &&
        new Date(expensive.date).getMonth() === new Date(selectedDate).getMonth() &&
        new Date(expensive.date).getFullYear() === new Date(selectedDate).getFullYear());

        const expensivesTotal = expensives.reduce((accumulator: number, expensive: TransactionData) => {
            return accumulator + parseFloat(expensive.amount);
        }, 0);

       // console.log(expensivesTotal);

        const totalByCategory : CategoryData[] = [];
    
        categories.forEach(category => {
            let categorySum = 0;
            expensives.forEach((expensive : TransactionData) => {
                if( expensive.category === category.key ) {
                    categorySum += Number(expensive.amount);
            }
        });
     if (categorySum >0) {
        const totalFormatted = categorySum
        .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`;

        totalByCategory.push({
            key: category.key,
            name: category.name,
            color: category.color,
            total: categorySum,
            totalFormatted: totalFormatted,
            percent,
     });
     }
    });

    // para olharmos se está dando certo eu usarei um console log aqui fora da estrutura do código
    //console.log(totalByCategory);


    setTotalByCategories(totalByCategory);

    setIsLoading(false);
}

    useFocusEffect(useCallback(() => {
        loadData();
    }, [selectedDate]));

// como será uma lista pequena eu farei um map ao inves de uma FlatList

    return (
        <Container>
           
                <Header>
                    <Title>Resumo por Categoria</Title>
                </Header>

                {
            isLoading ? 
                <LoadContainer>
                    <ActivityIndicator 
                        color={theme.colors.primary}
                        size="large"
                        />
                    </LoadContainer> :
                <>

                <Content
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 24,
                        paddingBottom: useBottomTabBarHeight()
                    }}
                >

                    <MonthSelect>
                        <MonthSelectButton onPress={() => handleDateChange('prev')} >
                            <MonthSelectIcon name="chevron-left" />
                        </MonthSelectButton>
                            
                        <Month>{format( selectedDate, 'MMMM, yyyy', {locale: ptBR})}</Month>

                        <MonthSelectButton onPress={() => handleDateChange('next')}>
                            <MonthSelectIcon name="chevron-right" />
                        </MonthSelectButton>
                        
                    </MonthSelect>


                    <ChartContainer>
                            <VictoryPie 
                                data={totalByCategories}
                                colorScale={totalByCategories.map(Category => Category.color)}
                                style={{
                                    labels: {
                                        fontSize: RFValue(18),
                                        fontWeight: 'bold',
                                        fill: theme.colors.shape,
                                    }
                                }}
                                labelRadius={60}
                                x="percent"
                                y="total"
                            />
                    </ChartContainer>

                    {
                        totalByCategories.map(item => (
                        <HistoryCard 
                        key={item.key}
                        title={item.name}
                        amount={item.totalFormatted}
                        color={item.color}
                    />
                        ))
                    }
                </Content>
                </>
            }
        </Container>
    );
}