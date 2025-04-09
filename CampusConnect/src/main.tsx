import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ApolloProvider} from "@apollo/client";
import {apolloClient} from "./api/graphqlConfig";

createRoot(document.getElementById('root')!).render(
    <ApolloProvider client={apolloClient}>
        <App/>
    </ApolloProvider>
)
