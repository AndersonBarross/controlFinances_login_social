import React from 'react';
import { FlatList } from "react-native-gesture-handler"
import { categories } from "../../components/utils/categories";
import { TouchableOpacityProps } from "react-native";
import { Button } from '../../components/Forms/Button';



import { 
    Container,
    Header,
    Title,
    Category,
    Icon,
    Name,
    Separator,
    Footer,
   
} from "./styles";

interface Category {
    key: string;
    name: string;
}
// como nao queremos retornar nada a gente usa essa marreta de colocar void.
export interface Props {
    category: Category;
    setCategory: (category: Category) => void;
    closeSelectCategory: () => void;
}

export function CategorySelect( {
     category,
     setCategory,
     closeSelectCategory
    } : Props) {
        function handleCategorySelect(category: Category){
            setCategory(category);
        }
    return (
        <Container>
            <Header>
                <Title>
                Categoria
                </Title>
            </Header>
            <FlatList
                data={categories}
                style={{ flex:1, width: '100%'}}
                keyExtractor={(item) => item.key}
                renderItem={({ item} ) => (
                    <Category
                        onPress={() =>handleCategorySelect(item)}
                        isActive={category.key === item.key}

                    >
                        <Icon name={item.icon} />
                        <Name>{item.name}</Name>
                    </Category>
                )}
                ItemSeparatorComponent={() => <Separator />}
            />
            <Footer>
                <Button 
                    title="Selecionar" 
                    onPress={closeSelectCategory}
                    />
               
            </Footer>

        </Container>
    )
}