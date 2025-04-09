import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Création du lien HTTP de base
const httpLink = createHttpLink({
    uri: 'http://localhost:4000/graphql',
});

// Middleware d'authentification
const authLink = setContext((_, { headers }) => {
    // Récupération du token depuis le localStorage
    const token = localStorage.getItem('token');

    // Retour des en-têtes avec le token d'autorisation si disponible
    return {
        headers: {
            ...headers,
            authorization: token ? `${token}` : "",
        }
    };
});

// Configuration de l'instance Apollo Client
export const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});