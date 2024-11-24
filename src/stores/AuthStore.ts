import {create} from 'zustand';
// import {persist} from 'zustand/middleware';

interface AuthState {
    isLoggedIn: boolean;
    login: string | null;
}

interface AuthStateActions {
    setLogin: (login: string) => void;
    logout: () => void;
}

const initialState: AuthState = {
    isLoggedIn: false,
    login: "",
};

const useAuthStore = create<AuthState & AuthStateActions>()(
    (set) => ({
        ...initialState,
        setLogin: (login) => set({isLoggedIn: true, login}),
        logout: () => set({isLoggedIn: false, login: null}),
    })
);

// const useAuthStore = create<AuthState & AuthStateActions>()(
//     persist(
//         (set) => ({
//             ...initialState,
//             setLogin: (login) => set({ isLoggedIn: true, login }),
//             logout: () => set({ isLoggedIn: false, login: null }),
//         }),
//         {
//             name: 'user-storage', // имя ключа в localStorage
//         }
//     )
// );

export default useAuthStore;
