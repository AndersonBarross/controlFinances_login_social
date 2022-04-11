import React, { useState } from "react";
import { useContext } from "react";
//import AppleSvg from "../../assets/svg/apple.svg";
import AppleSvg from "../../assets/a4.svg";
import GoogleSvg from "../../assets/g1.svg";
import LogoSvg from "../../assets/finances12.svg";
import { SignInSocialButton } from "../../components/SignInSocialButton";
import { ActivityIndicator, Alert, Platform } from "react-native";
import { useTheme } from "styled-components";
import { 
    Container, Header, TitleWrapper, Title, SignInTitle, Footer,FooterWrapper,
 } from "./styles";

import { RFValue } from "react-native-responsive-fontsize";
import { AuthContext } from "../../AuthContext";
import { useAuth } from "../../hooks/auth";


export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);


  const {signInWithGoogle, signInWithApple } =  useAuth();
 // console.log(user);// só para testar e ver o que está voltando do contexto

 const theme = useTheme();

 async function handleSignInWithGoogle() {
    try {
      setIsLoading(true);
      return await signInWithGoogle();
    } catch (error) {
      console.log(error);
      Alert.alert("Erro ao fazer login, não foi possível conectar a conta goole");
      setIsLoading(false);
    } 
  
 }

 async function handleSignInWithApple() {
  try {
    setIsLoading(true);
     return await signInWithApple();
  } catch (error) {
    console.log(error);
    Alert.alert("Erro ao fazer login, não foi possível conectar a conta Apple");
    setIsLoading(false);
  } 

}

  return(
      <Container>
          <Header>
              <TitleWrapper>
                    <LogoSvg 
                        width={RFValue(120)}
                        height={RFValue(68)}
                    />
                    <Title>
                        Controle suas{'\n'} finanças de forma{'\n'} muito simples.
                    </Title>
              </TitleWrapper>
            < SignInTitle>
                Faça seu login com{'\n'} uma das contas abaixo.
            </SignInTitle>

          </Header>

          <Footer>
              <FooterWrapper>
                  < SignInSocialButton
                  
                    title="Entrar com o Google"
                    svg={GoogleSvg}
                    onPress={handleSignInWithGoogle}
                  />

                  {
                  Platform.OS === "ios" && 
                   < SignInSocialButton
                      title="Entrar com o Apple"
                      svg={AppleSvg}
                      onPress={handleSignInWithApple}
                  />
                }

              </FooterWrapper>

              {isLoading && 
                <ActivityIndicator
                  color={theme.colors.shape} 
                  style={{marginTop: 18}}
                  />}
        
          </Footer>

      </Container>
  )
}