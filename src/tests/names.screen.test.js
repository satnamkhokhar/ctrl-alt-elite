
import { fireEvent, render } from '@testing-library/react-native';
import NamesScreen from '../NamesScreen';

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockedNavigate }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
}));

describe('NamesScreen Conditional Navigation', () => {
  it('should navigate to EmailPasswordScreen only when all fields are filled', () => {
    const { getByPlaceholderText, queryByText, getByText } = render(<NamesScreen />);

    const initialNextButton = queryByText('Next');
    if (initialNextButton) {
        fireEvent.press(initialNextButton);
        expect(mockedNavigate).not.toHaveBeenCalled();
    }

    fireEvent.changeText(getByPlaceholderText(/first name/i), 'John');
    fireEvent.changeText(getByPlaceholderText(/last name/i), 'Doe');
    fireEvent.changeText(getByPlaceholderText(/username/i), 'johndoe123');

    const nextButton = getByText('Next');
    fireEvent.press(nextButton);

    expect(mockedNavigate).toHaveBeenCalledWith('EmailPassword');
  });
});
