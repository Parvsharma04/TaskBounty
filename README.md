# TaskBounty

![Mockup](/TaskBountyMockup.png)

A decentralized, blockchain-based platform that allows users to post tasks, set bounties, and complete tasks to earn rewards without relying on a central authority. This project leverages Web3 technologies to provide a secure, user-owned task management system.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This project is a decentralized application (DApp) that enables users to create tasks, set bounties, and complete tasks for rewards. The decentralized nature of this platform ensures that users have full ownership of their tasks and rewards, with no central entity controlling the platform.

## Features

- **Decentralized User Authentication**: Secure and private user authentication using wallets (e.g., MetaMask).
- **Post Tasks**: Users can create, edit, and delete their tasks stored on the blockchain.
- **Set and Claim Bounties**: Users can set bounties for tasks, and other users can claim them upon completion.
- **Censorship Resistance**: Task and bounty data is stored on a decentralized network, making it resistant to censorship.
- **User-Owned Data**: Users have full ownership of their data, including tasks and bounties.

## Technology Stack

<!-- - **Smart Contracts**: Solidity -->

- **Blockchain**: Solana
- **Frontend**: Next.js, Web3.js
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Wallet Integration**: MetaMask, Phantom, Solflare, Alpha

## Prerequisites

- [Node.js](https://nodejs.org/) and npm installed
- [MetaMask](https://metamask.io/) wallet extension for Ethereum
- [Phantom](https://phantom.app/), [Solflare](https://solflare.com/), or [Alpha](https://alpha.solana.com/) wallet extensions for Solana



## Contributing

Thank you for your interest in contributing to TaskBounty! To set up the project for development and start contributing, follow the steps below:

### Step 1: Fork and Clone the Repository

1. Fork the repository on GitHub to your account.
2. Clone your forked repository locally using the command:

   ```bash
   git clone git@github.com:Parvsharma04/TaskBounty.git
   ```

3. Navigate into the project directory:

   ```bash
   cd TaskBounty
   ```

### Step 2: Set Up the Backend

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the backend server:

   ```bash
   npm run dev
   ```

   The backend should now be running on `http://localhost:3000`.

### Step 3: Set Up the Frontend

1. Navigate to the frontend client directories:

   ```bash
   cd ../parent
   ```

2. Install dependencies and run the app:

   ```bash
   npm install
   npm run dev
   ```
   ```

   The frontend app should be running on `http://localhost:3001`.

4. Similarly, navigate to the `Client` directory:

   ```bash
   cd ../client
   ```

5. Install dependencies and run the app:

   ```bash
   npm install
   npm run dev
   ```

   The secondary frontend app should be running on `http://localhost:3002`.

6. Similarly, navigate to the `Worker/Tester` directory:

   ```bash
   cd ../tester
   ```

7. Install dependencies and run the app:

   ```bash
   npm install
   npm run dev
   ```

   The secondary frontend app should be running on `http://localhost:3003`.

### Step 4: Set Up MetaMask and Connect to Devnet

1. Install MetaMask on your browser and create a wallet if you haven't already.
2. Add the Ethereum test network (e.g., Rinkeby, Kovan) in MetaMask for development.
3. Connect your wallet to the DApp after running the frontend.

### Step 5: Testing

1. Run tests using:

   ```bash
   npm run build
   ```

2. Make sure there are no errors in the build before pushing changes.

### Step 6: Submitting Changes

1. Create a new branch for your feature or bug fix:

   ```bash
   git checkout -b feature-branch
   ```

2. Commit your changes and push the branch to your fork:

   ```bash
   git add .
   git commit -m "Description of your changes"
   git push origin feature-branch
   ```

3. Open a Pull Request (PR) on the main repository for your branch, following the contribution guidelines.

Happy coding! Let us know if you have any questions in the [Issues](https://github.com/Parvsharma04/TaskBounty/issues) section.


## License

This project is proprietary and not open-source. No permission is granted to use, modify, distribute, or create derivative works based on this code without explicit written permission.