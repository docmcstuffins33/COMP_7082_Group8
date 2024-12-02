import { uploadProfilePic, fetchUser ,getProfilePic} from '../Firebase/FirebaseUtils';  // Import the functions to test
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';


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


describe('User Setting Test', () => {
    beforeEach(() => {
        // Reset all mock functions before each test
        jest.clearAllMocks();
    });

    test("Upload Profile Picture", async () => {
        const mockFile = new Blob(['image'], { type: 'image/png' });
        const mockUserData = { Points: 100 };
        const mockUserID = 'userID123';
        const setLoading = jest.fn();
        const mockFileRef = { fullPath: 'ProfilePictures/userID123.png' };

        // Mock the functions
        uploadBytes.mockResolvedValue({ ref: mockFileRef });

        doc.mockReturnValueOnce({ id: mockUserID });
        setDoc.mockResolvedValueOnce();
        // upload it
        await uploadProfilePic(mockFile, mockUserID, mockUserData, setLoading);

        //ensure the profile pic is uploaded
        expect(setDoc).toHaveBeenCalledWith(
            expect.anything(),
            { ...mockUserData, photoURL: mockFileRef.fullPath },
            { merge: true }
        );

        getDownloadURL.mockResolvedValueOnce({ref: mockFileRef});
        // get profile pic
        const result = await getProfilePic(mockUserID);
        // Check the result and ensure successful upload
        // console.log(result)
        expect(result.ref).toBe(mockFileRef);
    });
});
