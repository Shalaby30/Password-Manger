import { Client, Account, Databases } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') 
  .setProject('66e7074500265949c8d7'); 

const account = new Account(client);
const databases = new Databases(client); 

export { client, account, databases };
