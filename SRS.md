# Software Requirements Specification (SRS)  
## Coin Collection React Frontend

## 1. Purpose and Scope
This document defines the requirements for a local-only system consisting of a React single-page web application and a local API service that persists data to the repository filesystem. The system allows users to register, login/logout, and manage a coin collection. Users must be logged in to add coins.

## 2. Overall Description
The system is a modern but simple React SPA hosted locally and a local API service running on the same machine. Coin data is loaded from and persisted to JSON files within the repository under a per-user folder. There are no external hosted services.

## 3. Functional Requirements
- **F0: Accounts (Register/Login/Logout)**  
  The system shall support user accounts with **username** and **password**. Users shall be able to register, login, and logout. Passwords shall not be stored in plaintext.

- **F1: Add Coin**  
  The system shall allow a **logged-in** user to add a coin via a modal dialog. The modal shall contain the fields: denomination, face value, year, and issuing authority. The denomination field shall be a dropdown with the options *Farthing*, *Shilling*, *Penny*, and *Florin*. The year must be a numeric value between 1 and the current calendar year. The modal shall also allow the user to optionally upload a coin image (see **F4**). When the user presses the **Add Coin** button, the coin (and optional image) shall be saved to the collection associated with the logged-in user.

- **F2: View Coins**  
  The system shall display all coins for the currently logged-in user on the home page in a tiled layout, with each tile showing the coin’s stored information. If a coin has an associated image, the tile shall display that image.

- **F3: Delete Coin**  
  The system shall allow a **logged-in** user to delete a coin by pressing an “X” button located in the top-right corner of a coin tile. The coin shall be removed immediately with no confirmation prompt.

- **F4: Upload Image**  
  The system shall allow the user to choose and upload an image from the **Add Coin** modal. The image shall be stored in the frontend as a **JPEG** associated with the coin record. If an image is provided, it shall be displayed on the corresponding coin tile.

## 4. Data Requirements
- User account data shall be stored in the repository under `data/users/<username>/user.json`.
- Simple hashing shall be used to store passwords.
- Coin data for a user shall be stored in the repository under `data/users/<username>/coins.json` as JSON objects.
- Coin data shall be saved when the user presses the **Add Coin** button in the modal or the **X** button on a coin tile.
- Coin images, if provided, shall be persisted as a JPEG-encoded representation suitable for JSON storage (e.g., a `data:image/jpeg;base64,...` string) associated with the coin record.
- Coin data shall not be stored in the user’s browser `localStorage`.

## 5. Non-Functional Requirements
The user interface shall be simple and modern in style. The application shall be responsive for desktop use and operate entirely offline, hosted locally with no external backend services.
