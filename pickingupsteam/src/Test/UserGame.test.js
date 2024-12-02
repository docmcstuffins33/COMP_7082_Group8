import {addSelectedGame, removeSelectedGame, fetchUser} from '../Firebase/FirebaseUtils';  // Import the functions to test
import { doc, getDoc, setDoc } from 'firebase/firestore';



jest.mock('firebase/app', () => ({
    initializeApp: jest.fn(),
}));


jest.mock('firebase/firestore', () => ({
    ...jest.requireActual('firebase/firestore'),
    getFirestore: jest.fn(),
    doc: jest.fn(),
    setDoc: jest.fn(),
    getDoc: jest.fn(),
    getDocs: jest.fn(),
    updateDoc: jest.fn(),
    deleteField: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
    ...jest.requireActual('firebase/storage'),
    getStorage: jest.fn(),
    ref: jest.fn(),
    getDownloadURL: jest.fn(),
    uploadBytes: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
    ...jest.requireActual('firebase/auth'),
    getAuth: jest.fn(),
}));

//test data
const userId = "Test123456";
const userData = { name: 'ILoveCCLemon', email: 'cclemon@gmail.com' };
const selectedGame = "Lemon";

describe('User Game Test', () => {
    beforeEach(() => {
        // Reset all mock functions before each test
        jest.clearAllMocks();
    });

    test("add selected game", async () => {
        // mock add selected game
        doc.mockReturnValueOnce({id: userId});
        setDoc.mockResolvedValueOnce();
        const result = await addSelectedGame(userId, userData, selectedGame);

        expect(setDoc).toHaveBeenCalledWith(
            { id: userId },
            { ...userData, SelectedGame: selectedGame }, // Updated user data with selected game
            { merge: true }
        );

        // the selected game should be added
        expect(result).toEqual({ ...userData, SelectedGame: selectedGame });
    });

    test("remove selected game", async () => {
        doc.mockReturnValueOnce({ id: userId });

        // Mock setDoc to resolve successfully
        setDoc.mockResolvedValueOnce();

        const result = await removeSelectedGame(userId, userData);

        // Check if the new user data is correctly updated
        expect(setDoc).toHaveBeenCalledWith(
            { id: userId }, 
            { ...userData, SelectedGame: null, Points: 200 }, // Updated user data with selected game = null
            { merge: true }
        );

        //selected game should be null
        expect(result).toEqual({ ...userData, SelectedGame: null, Points: 200 });
    });
});
