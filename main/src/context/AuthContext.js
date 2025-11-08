import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api'; // O objeto Axios


// 1. Cria o Contexto
const AuthContext = createContext();

const setupAxiosHeader = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
}


// 2. Define o Provedor (Provider)
export const AuthProvider = ({ children }) => {
    // Armazena o token e o usuário em memória

    const initialToken = localStorage.getItem('userToken');
    const initialUser = localStorage.getItem('userName') ? {
        nome: localStorage.getItem('userName'),
        cargo: localStorage.getItem('userCargo'),
    } : null;

    setupAxiosHeader(initialToken);

    const [token, setToken] = useState(initialToken);
    const [usuario, setUsuario] = useState(initialUser);
    const [loading, setLoading] = useState(false);

    // Função que define o token no state e no cabeçalho padrão do Axios
    useEffect(() => {
        if (token) {
            // Salva no localStorage na primeira vez e restaura o Axios header
            localStorage.setItem('userToken', token);
            localStorage.setItem('userName', usuario.nome);
            localStorage.setItem('userCargo', usuario?.cargo || '');
            setupAxiosHeader(token);
        } else {
            // Limpa o localStorage e o Axios no Logout
            localStorage.removeItem('userToken');
            localStorage.removeItem('userName');
            localStorage.removeItem('userCargo');
            setupAxiosHeader(null);
        }
        setLoading(false);
    }, [token, usuario]); // Dispara sempre que o token ou usuário muda

    // Função que define o token no state
    const setAuthToken = (novoToken, dadosUsuario) => {
        setToken(novoToken);
        setUsuario(dadosUsuario);
        // O useEffect cuida do restante (localStorage e Axios header)
    };

    const logout = () => {
        setAuthToken(null, null); // Limpa o token e o usuário na memória e no Axios
    };

    if (loading) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Carregando Sessão...</div>;
    }

    return (
        <AuthContext.Provider value={{
            token,
            usuario,
            setAuthToken,
            logout,
            isAuthenticated: !!token,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook para facilitar o uso do contexto
export const useAuth = () => useContext(AuthContext);