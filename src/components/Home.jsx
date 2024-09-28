import { useState, useEffect } from "react";
import {
  PlusIcon,
  TrashIcon,
  MoonIcon,
  SunIcon,
  EyeIcon,
  EyeOffIcon,
  KeyIcon,
  LogOutIcon,
  GithubIcon,
  LinkedinIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { databases, account } from "../appwriteConfig";
import { useNavigate } from "react-router-dom";

const DATABASE_ID = "66e70c03000b616720bf";
const COLLECTION_ID = "66e70c1b000c4646dfd4";

export default function Home() {
  const [credentials, setCredentials] = useState([]);
  const [website, setWebsite] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState({});
  const [generatedPassword, setGeneratedPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await account.get();
      } catch (error) {
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate]);

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
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
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
        Password: password,
        email,
      };

      const response = await databases.createDocument(DATABASE_ID, COLLECTION_ID, "unique()", newCredential);
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
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:',.<>?";
    let newPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }
    setGeneratedPassword(newPassword);
  };

  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
  };

  const handleSignOut = async () => {
    try {
      await account.deleteSession('current');
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto p-4 flex-grow transition-colors duration-200 ease-in-out dark:bg-gray-900">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold dark:text-gray-100">Password Manager</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <SunIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                aria-label="Toggle dark mode"
              />
              <MoonIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </div>
            <Button onClick={handleSignOut} variant="outline" className="dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:border-gray-600">
              <LogOutIcon className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
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
                    className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:dark:border-blue-500"
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
                    className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:dark:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="dark:text-gray-200">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:dark:border-blue-500"
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
                    className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:dark:border-blue-500"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full mt-4 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Credential
              </Button>
            </form>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-200 ease-in-out">
              <h2 className="text-2xl font-semibold mb-4 dark:text-gray-100">
                Password Generator
              </h2>
              <Button onClick={generatePassword} className="w-full mb-4 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white">
                Generate Password
              </Button>
              {generatedPassword && (
                <div className="flex flex-col items-start">
                  <p className="text-lg font-semibold dark:text-gray-100 mb-2">
                    Generated Password
                  </p>
                  <Input
                    type="text"
                    value={generatedPassword}
                    readOnly
                    className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  />
                  <Button onClick={copyPasswordToClipboard} className="mt-2 dark:bg-green-600 dark:hover:bg-green-700 dark:text-white">
                    Copy to Clipboard
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-200 ease-in-out">
            <h2 className="text-2xl font-semibold mb-4 dark:text-gray-100 flex items-center">
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
                      <h3 className="font-semibold dark:text-gray-100">
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
                      className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300"
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
      <footer className="bg-gray-100 dark:bg-gray-800 py-6 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4 md:mb-0">
              © 2023 Mohamed Shalaby. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/shalaby30"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200"
              >
                <GithubIcon className="w-6 h-6" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200"
              >
                <LinkedinIcon className="w-6 h-6" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 
