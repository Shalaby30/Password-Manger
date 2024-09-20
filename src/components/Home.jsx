import { useState, useEffect } from "react";
import {
  PlusIcon,
  TrashIcon,
  MoonIcon,
  SunIcon,
  EyeIcon,
  EyeOffIcon,
  KeyIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { databases, account } from "../appwriteConfig"; // Import account for authentication check

const DATABASE_ID = "66e70c03000b616720bf"; 
const COLLECTION_ID = "66e70c1b000c4646dfd4"; 

export default function Home() {
  const [credentials, setCredentials] = useState([]);
  const [website, setWebsite] = useState("");
  const [userName, setUserName] = useState("");
  const [Password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState({});
  const [generatedPassword, setGeneratedPassword] = useState("");

  // Check if user is authenticated on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await account.get(); // Fetch logged-in user details
        if (!user) {
          // If no user is found, redirect to login
          window.location.href = "/login";
        }
      } catch (error) {
        // In case of error (no user), redirect to login
        window.location.href = "/login";
      }
    };

    checkAuth(); // Call the function to check authentication
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID
        );
        setCredentials(response.documents);
      } catch (error) {
        console.error("Error fetching credentials:", error);
      }
    };

    fetchCredentials();
  }, []);

  const addCredential = async (e) => {
    e.preventDefault();
    try {
      const newCredential = {
        20: website,
        userName,
        Password,
        email,
      };

      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        "unique()",
        newCredential
      );
      setCredentials([...credentials, response]);
      setWebsite("");
      setUserName("");
      setPassword("");
      setEmail("");
    } catch (error) {
      console.error("Error adding credential:", error);
    }
  };

  const deleteCredential = async (id) => {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
      setCredentials(credentials.filter((cred) => cred.$id !== id));
    } catch (error) {
      console.error("Error deleting credential:", error);
    }
  };

  const togglePasswordVisibility = (id) => {
    setShowPassword((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const generatePassword = () => {
    const length = 12;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:',.<>?";
    let Password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      Password += charset[randomIndex];
    }
    setGeneratedPassword(Password);
  };

  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
  };

  return (
    <div className="container mx-auto p-4 transition-colors duration-200 ease-in-out dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Password Manager</h1>
        <div className="flex items-center space-x-2">
          <SunIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <Switch
            checked={darkMode}
            onCheckedChange={setDarkMode}
            aria-label="Toggle dark mode"
          />
          <MoonIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <form
            onSubmit={addCredential}
            className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-200 ease-in-out"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website" className="dark:text-gray-200">
                  Website
                </Label>
                <Input
                  id="website"
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  required
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="userName" className="dark:text-gray-200">
                  UserName
                </Label>
                <Input
                  id="userName"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="Password" className="dark:text-gray-200">
                  Password
                </Label>
                <Input
                  id="Password"
                  type="password" 
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="email" className="dark:text-gray-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
            </div>
            <Button type="submit" className="w-full mt-4">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Credential
            </Button>
          </form>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-200 ease-in-out">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">
              Password Generator
            </h2>
            <Button onClick={generatePassword} className="w-full mb-4">
              Generate Password
            </Button>
            {generatedPassword && (
              <div className="flex flex-col items-start">
                <p className="text-lg font-semibold dark:text-white mb-2">
                  Generated Password
                </p>
                <Input
                  type="text"
                  value={generatedPassword}
                  readOnly
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                <Button onClick={copyPasswordToClipboard} className="mt-2">
                  Copy to Clipboard
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-200 ease-in-out">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white flex items-center">
            <KeyIcon className="w-6 h-6 mr-2" />
            Saved Passwords
          </h2>
          
          <div className="space-y-4">
            {credentials.map((cred) => (
              <div
                key={cred.$id}
                className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg transition-all duration-200 ease-in-out hover:shadow-md"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold dark:text-white">
                      {cred[20]} 
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      UserName: {cred.userName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Email: {cred.email}
                    </p>
                    <div className="flex items-center">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mr-2">
                        Password:{" "}
                        {showPassword[cred.$id] ? cred.Password : "********"}
                      </p>
                      <button
                        onClick={() => togglePasswordVisibility(cred.$id)}
                        className="ml-2"
                      >
                        {showPassword[cred.$id] ? (
                          <EyeOffIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        ) : (
                          <EyeIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteCredential(cred.$id)}
                    className="text-red-500 dark:text-red-400"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
