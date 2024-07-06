import { ReactNode, createContext, useContext, useReducer } from 'react';

// export const ExampleContext = createContext();

// const reducer = (state, pair) => ({ ...state, ...pair });

// const initialState = {
//   sound: 'bark',
// };

// export function ExampleProvider({ children }: { children: React.ReactNode }) {
//   const [state, update] = useReducer(reducer, initialState);

//   return <ExampleContext.Provider value={{ state, update }}>{children}</ExampleContext.Provider>;
// }

// export const LanguageContext = createContext({
//   language: 'en',
//   setLanguage: () => {},
// });

// interface LanguageContextProviderProps {
//   children?: React.ReactNode;
// }

// export function LanguageContextProvider({ children }: LanguageContextProviderProps) {
//   const [language, setLanguage] = useState('en');
//   return (
//     <LanguageContext.Provider value={{ language, setLanguage: () => {} }}>
//       {children}
//     </LanguageContext.Provider>
//   );
// }

/// Demo with useReducer
// Define the shape of the state
interface State {
  title?: string;
}

// Define the actions
type Action = { type: 'update'; payload: { title: string } } | { type: 'reset' };

// Initial state
const initialCountState: State = {};

// Create the context
const PageContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | undefined>(
  undefined
);

// Reducer function
const pageReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'update':
      return { ...state, ...action.payload };
    case 'reset':
    default:
      return {};
  }
};

// Provider component
export function PageProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(pageReducer, initialCountState);
  const value = { state, dispatch };
  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
}

// Custom hook to use the PageContext
export const usePageContext = () => {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error('usePageContext must be used within a PageProvider');
  }
  return context;
};
