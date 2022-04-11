import React from "react";
import { 
    createContext,
    ReactNode,
    useContext,
    useState,
    useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;

// aos 1:10:16 aparece a seguinte importação google:import * as Google from 'expo-google-app-auth'; como até aqui funcionou então deixarei como está
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';


interface AuthProviderProps {
    children: ReactNode;
}

interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface IAuthContextData {
    user: User;
    signInWithGoogle(): Promise<void>;
    signInWithApple(): Promise<void>;
    signOut(): Promise<void>;
    userStorageLoading: boolean;
}

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);



interface AuthorizationResponse {
    params: {
        access_token: string;

    };
    type: string;
}


function AuthProvider({children} : AuthProviderProps) {
    const [user, setUser] = useState<User>({} as User);
    const [userStorageLoading, setUserStorageLoading] = useState(true);

    const userStorageKey = '@gofinances:user';



async function signInWithGoogle() {
    try{
        const RESPONSE_TYPE = 'token';
        const SCOPE = encodeURI('profile email');

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

        const {type, params} = await AuthSession.startAsync({authUrl}) as AuthorizationResponse;

        if(type === 'success'){
            // o copilot sugeriu usar v3. ele indicou usar v1. vou com o professor.
          //  const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${params.access_token}`);
            const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
            const userInfo = await response.json();
        
            setUser({
                id: userInfo.id,
                email: userInfo.email,
                name: userInfo.given_name,
                photo: userInfo.picture,
            })
                   console.log(userInfo);
        }

    } catch (error) {
        throw new Error(error);
    }
}

async function signInWithApple() {
    try {
        const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ]
        });

        if (credential) {
            const name = credential.fullName!.givenName!;
            const photo =  `https://ui-avatars.com/api/?name=${name}&length=1`;
            const userLogged =({
                id: String(credential.user),
                email: credential.email!,
                name,
                photo,
            })

            
        setUser(userLogged);
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
        }

//console.log(credential);
              
    } catch (error) {
        throw new Error(error);
        //console.log(error);
    }
}

async function signOut() {
    try {
        setUser({} as User);
        await AsyncStorage.removeItem(userStorageKey);
    } catch (error) {
        throw new Error(error);
    }
}
    


//para carregar os dados do async Storage usaremos o useEffect

    useEffect(() => {
        async function loadUserStorageData() {
            const userStoraged = await AsyncStorage.getItem(userStorageKey);

            if(userStoraged){
                const userLogged = JSON.parse(userStoraged) as User;
                setUser(userLogged);
            }
            setUserStorageLoading(false);
        }

        loadUserStorageData();
    } , []);


    return(
        <AuthContext.Provider value={{ 
            user,
            signInWithGoogle,
            signInWithApple,
            signOut,
            userStorageLoading
            }} >
        {children}
        </AuthContext.Provider>
    )
}

function useAuth() {
    const context = useContext(AuthContext);
    return context;
}

export { AuthProvider, useAuth };
