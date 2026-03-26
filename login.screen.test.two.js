import { fireEvent, render } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockedNavigate,
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
}));

describe('LoginScreen Navigation', () => {
  it('should navigate to NamesScreen when Create Account is pressed', () => {
    const { getByText } = render(<LoginScreen />);
    
    const createAccountButton = getByText('Create Account');
    
    fireEvent.press(createAccountButton);
    
    expect(mockedNavigate).toHaveBeenCalledWith('NamesScreen');
  });
});
