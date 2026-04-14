import { fireEvent, render } from "@testing-library/react-native";
import LoginScreen from "../LoginScreen";

const mockNavigate = jest.fn();

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
}));

describe('LoginScreen Navigation', () => {
    it('should. go to home page on login', () => {
       const { getByText, getByPlaceholderText } = render(<LoginScreen/>);

       fireEvent.changeText(getByPlaceholderText('enter your email'), 'user@example.com');
       fireEvent.changeText(getByPlaceholderText('enter your password'), 'password123');
       
       const loginButton = getByText('Login');
       fireEvent.press(loginButton);

       expect(mockNavigate).toHaveBeenCalledWith('HomeScreen');
    });
});