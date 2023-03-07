// import { program } from 'commander';
// import appRoot from 'app-root-path';
// import * as path from 'path';
// import { promises as fs } from 'fs';
// import axios from 'axios';
// import UserModel from '../models/user.model';
// import { startServer } from './common';

// async function generateNewUserToken(userId: string = 'Alice') {
//   await startServer();
//   const user = await UserModel.findByEitherId(userId);
//   if (!user) {
//     throw new Error(`Couldn't find user for "${userId}" (maybe deleted?)`);
//   }
//   // Just good for logging in -- still need to get the actual id token

//   // console.log(credential.user.toJSON());
//   const user = await UserModel.findOne({ name: userId });
//   //   let token = axios.post('/')
//   // let tokenResult = await credential.user.getIdTokenResult();
//   // console.log(tokenResult.expirationTime);

//   let tokenPath = path.join(appRoot.path, 'client-auth-token.txt');
//   await fs.writeFile(tokenPath, token, 'utf8');
//   console.log(`Written to ${tokenPath}`);

//   let jsonPath = path.join(appRoot.path, 'client-auth-token.json');
//   await fs.writeFile(jsonPath, JSON.stringify({ access_token: token }), 'utf8');

//   process.exit(0);
// }

// // // Doesn't work of course...
// // async function generateNewUserTokenForFacebook(email) {
// //   const provider = new firebase.auth.FacebookAuthProvider();
// //   provider.setCustomParameters({
// //     display: 'popup',
// //   });
// //   await firebase.auth().signInWithPopup(provider);
// // }

// // (async () => {
// //   try {
// //     program.arguments('[userId]').action(generateNewUserToken);
// //     // program.arguments('[email] [password]').action(generateNewUserToken);
// //     program.command('facebook').action(generateNewUserTokenForFacebook);

// //     await program.parseAsync(process.argv);
// //   } catch (e) {
// //     if (e instanceof HTTPError) {
// //       console.error(e.response.body);
// //     } else {
// //       console.error(e);
// //       console.error(e.stack);
// //     }
// //   }
// //   process.exit();
// // })();
