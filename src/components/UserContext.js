import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState({firstName: '', lastName: '', userName: ''});
    const [user, setUser] = useState(null)

    async function login(email, password) {
        try {
            await account.createEmailPasswordSession(email, password)
            const response = await account.get()
            setUser(response)
        } catch(error) {
            console.log(error.message)
        }
    }

    async function register(email, password) {
        try {
            await account.create(ID.unique(), email, password)
            await login(email, password)
        } catch(error) {
            console.log(error.message)
        }
    }

    async function logout() {
        await account.deleteSession("current")
        setUser(null)
    }

    return (
        <UserContext.Provider value={{ userData, setUserData, user, login, register, logout }}>
            {children}
        </UserContext.Provider>
    );
};