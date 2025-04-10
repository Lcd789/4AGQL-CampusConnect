import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// Création du lien HTTP de base
const httpLink = createHttpLink({
    uri: 'http://localhost:4000/graphql',
});

// Middleware d'authentification
const authLink = setContext((_, { headers }) => {
    // Récupération du token depuis le localStorage
    const token = localStorage.getItem('token');
    console.log('Token utilisé:', token);

    // Retour des en-têtes avec le token d'autorisation si disponible
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    };
});

// Lien pour gérer les erreurs
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) => {
            console.error(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            );
        });
    }
    if (networkError) {
        console.error(`[Network error]: ${networkError}`);
    }
});

// Configuration de l'instance Apollo Client
export const apolloClient = new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache({
        // Vous pouvez ajouter des options de typePolicy si nécessaire
    }),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
        },
        query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
        },
        mutate: {
            errorPolicy: 'all',
        },
    },
});