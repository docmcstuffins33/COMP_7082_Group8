import { fetchUser, writeUser, addCredit } from '../Firebase/FirebaseUtils';  // Import the functions to test
import { getDoc, setDoc, doc } from 'firebase/firestore';


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
const mockUserData = { name: 'ILoveCCLemon', email: 'cclemon@gmail.com' };
const MockUserID = 'Test123456';

describe('User Account Test', () => {
    beforeEach(() => {
        // Reset all mock functions before each test
        jest.clearAllMocks();
    });
    test("Create a new user", async () => {
        
        // mock fetch empty user
        doc.mockReturnValueOnce({ id: MockUserID });

        getDoc.mockResolvedValueOnce({ exists: () => false });
        const nonExistUser = await fetchUser(MockUserID);
        expect(nonExistUser).toBeNull();
        
        //mock create new user
        doc.mockReturnValueOnce({ id: MockUserID });
        setDoc.mockResolvedValueOnce();

        await writeUser(MockUserID, mockUserData);

        //a new user should be created
        expect(setDoc).toHaveBeenCalledWith(
            expect.anything(),
            mockUserData,
            { merge: true }
        )
    })

    test("Update a user", async () => {
        // mock fetch user data
        doc.mockReturnValueOnce({ id: MockUserID });        
        getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockUserData });
        const userData = await fetchUser(MockUserID);
        expect(userData).toEqual(mockUserData);

        //mock update user
        doc.mockReturnValueOnce({ id: MockUserID });
        setDoc.mockResolvedValueOnce();
        const updatedData = { name: 'cclemon', email: 'cclemon@gmail.com' };
        await writeUser(MockUserID, updatedData);

        //the user should be updated
        expect(setDoc).toHaveBeenCalledWith(
            expect.anything(),
            updatedData,
            { merge: true }
        )
    })

    test('Fetch user data', async () => {
        // mock fetch user data
        doc.mockReturnValueOnce({ id: MockUserID });
        getDoc.mockResolvedValueOnce({ exists: () => true, data: () => mockUserData });
        const userData = await fetchUser(MockUserID);
        console.log(userData)
        expect(userData).toEqual(mockUserData);
        expect(getDoc).toHaveBeenCalledWith({ id: MockUserID });
    });

    test('Fetch empty user', async () => {

        // mock fetch empty user
        doc.mockReturnValueOnce({ id: MockUserID });
        getDoc.mockResolvedValueOnce({ exists: () => false });
        const userData = await fetchUser(MockUserID);
        expect(userData).toBeNull();
    });


    test('addCredit should update the credit in Firestore', async () => {
        
        //old credit 100
        const userData = { Points: 100 };
        const amount = 50;

        //expected new credit
        const updatedData = { Points: 150 };

        //test add credit
        doc.mockReturnValueOnce({ id: MockUserID });
        setDoc.mockResolvedValueOnce();
        const newData = await addCredit(MockUserID, userData, amount);

        expect(setDoc).toHaveBeenCalledWith({ id: MockUserID }, updatedData, { merge: true });
        expect(newData.Points).toBe(updatedData.Points);
        
    })

    
});
